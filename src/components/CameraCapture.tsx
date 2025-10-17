import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Camera,
  X,
  Check,
  AlertCircle,
  RefreshCw,
  Info,
  Shield,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { PermissionGuide } from "./PermissionGuide";
import { detectObjects } from "../services/detection";
import { DetectionResult } from "../App";

interface CameraCaptureProps {
  onCapture: (imageUrl: string) => void;
  isProcessing?: boolean;
  // Optional callback to receive live detection results when live mode is enabled
  onLiveResults?: (results: DetectionResult[], annotatedImage?: string) => void;
}

type PermissionState = "unknown" | "granted" | "denied" | "prompt";

export function CameraCapture({
  onCapture,
  isProcessing = false,
  onLiveResults,
}: CameraCaptureProps) {
  const SHOW_DEBUG = true; // toggle to show debug panel and extra logs
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] =
    useState<PermissionState>("unknown");
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const [isSecureContext, setIsSecureContext] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const liveIntervalRef = useRef<number | null>(null);
  const [liveDetect, setLiveDetect] = useState(false);

  useEffect(() => {
    checkCameraAvailability();
    checkSecureContext();

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, []);

  // Ensure video element always receives stream after mount/render
  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        if (SHOW_DEBUG)
          console.log(
            "[sync effect] Set video.srcObject after mount",
            streamRef.current
          );
      }
    }
  }, [isCameraActive, streamRef.current]);

  const checkSecureContext = () => {
    // Camera requires HTTPS (except on localhost)
    const isSecure = window.isSecureContext;
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    setIsSecureContext(isSecure || isLocalhost);
  };

  const checkCameraAvailability = async () => {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraAvailable(false);
      setError("Camera API is not supported in this browser");
      return;
    }

    // Check permission state if API is available
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        setPermissionState(permissionStatus.state as PermissionState);

        // Listen for permission changes
        permissionStatus.onchange = () => {
          setPermissionState(permissionStatus.state as PermissionState);
        };

        if (permissionStatus.state === "granted") {
          setCameraAvailable(true);
        } else if (permissionStatus.state === "denied") {
          setCameraAvailable(false);
          setShowPermissionHelp(true);
        } else {
          setCameraAvailable(true); // Will prompt when user clicks
        }
      } else {
        setCameraAvailable(true); // Assume available, will check on activation
      }
    } catch (err) {
      console.log(
        "Permission API not available, will check on camera activation"
      );
      setCameraAvailable(true);
    }
  };

  const startCamera = async () => {
    setError(null);
    setShowPermissionHelp(false);

    // Check secure context first
    if (!isSecureContext) {
      setError("Camera requires HTTPS. Please use a secure connection.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (SHOW_DEBUG) console.log("startCamera: obtained stream", stream);

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (SHOW_DEBUG)
            console.log(
              "video onloadedmetadata, width/height:",
              videoRef.current?.videoWidth,
              videoRef.current?.videoHeight
            );
          videoRef.current?.play();
        };
        // If metadata already available, try play immediately
        if (videoRef.current.readyState >= 2) {
          if (SHOW_DEBUG) console.log("video readyState >= 2, auto-playing");
          videoRef.current.play().catch((e) => {
            if (SHOW_DEBUG) console.warn("video.play() failed:", e);
          });
        }
      }

      setIsCameraActive(true);
      setPermissionState("granted");
      setCameraAvailable(true);
    } catch (err: any) {
      // Don't log permission denied errors as they're expected user behavior
      if (
        err.name !== "NotAllowedError" &&
        err.name !== "PermissionDeniedError"
      ) {
        console.error("Error accessing camera:", err);
      }

      // Handle specific error types
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setPermissionState("denied");
        setError(
          "Camera permission denied. Please allow camera access to continue."
        );
        setShowPermissionHelp(true);
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        setError("No camera found on this device.");
        setCameraAvailable(false);
      } else if (
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        setError("Camera is already in use by another application.");
      } else if (err.name === "OverconstrainedError") {
        setError("Camera does not meet the required constraints.");
      } else if (err.name === "SecurityError") {
        setError("Camera access blocked due to security settings.");
      } else {
        setError(`Failed to access camera: ${err.message || "Unknown error"}`);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // also stop live detection if running
    stopLiveDetection();

    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    // Create canvas to capture the current frame
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the video frame to canvas
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL("image/jpeg", 0.9);

    // Stop camera and trigger callback
    stopCamera();
    onCapture(imageData);
  };

  // Draw detections on overlay canvas (synchronized with video size)
  const drawDetectionsOnOverlay = (results: DetectionResult[]) => {
    const overlay = overlayRef.current;
    const video = videoRef.current;
    if (!overlay || !video) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    // Match overlay size to video resolution
    overlay.width = video.videoWidth;
    overlay.height = video.videoHeight;
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    results.forEach((result, index) => {
      const bbox = result.bbox || { x: 0, y: 0, width: 0, height: 0 };
      const looksNormalized =
        Math.max(bbox.x, bbox.y, bbox.width, bbox.height) <= 1;
      const x = looksNormalized ? bbox.x * overlay.width : bbox.x;
      const y = looksNormalized ? bbox.y * overlay.height : bbox.y;
      const width = looksNormalized ? bbox.width * overlay.width : bbox.width;
      const height = looksNormalized
        ? bbox.height * overlay.height
        : bbox.height;

      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      const label = `${result.className} ${(result.confidence * 100).toFixed(
        1
      )}%`;
      ctx.font = "14px sans-serif";
      const textMetrics = ctx.measureText(label);
      const textHeight = 18;
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(x, y - textHeight, textMetrics.width + 8, textHeight);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, x + 4, y - 4);
    });
  };

  const stopLiveDetection = () => {
    if (liveIntervalRef.current) {
      window.clearInterval(liveIntervalRef.current);
      liveIntervalRef.current = null;
    }
    setLiveDetect(false);
  };

  const startLiveDetection = async (fps = 3) => {
    // Ensure camera started
    if (!streamRef.current) {
      await startCamera();
    }

    // Small delay to let video size settle
    await new Promise((r) => setTimeout(r, 250));

    setLiveDetect(true);
    const intervalMs = Math.max(100, Math.round(1000 / fps));

    liveIntervalRef.current = window.setInterval(async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      // Capture frame to temporary canvas
      const tcanvas = document.createElement("canvas");
      tcanvas.width = video.videoWidth;
      tcanvas.height = video.videoHeight;
      const tctx = tcanvas.getContext("2d");
      if (!tctx) return;
      tctx.drawImage(video, 0, 0, tcanvas.width, tcanvas.height);
      const imageData = tcanvas.toDataURL("image/jpeg", 0.7);

      try {
        const detections = await detectObjects(imageData);
        drawDetectionsOnOverlay(detections);
        if (typeof onLiveResults === "function") {
          onLiveResults(detections, imageData);
        }
      } catch (e) {
        console.warn("Live detection error:", e);
      }
    }, intervalMs);
  };

  const retryPermission = () => {
    setError(null);
    setShowPermissionHelp(false);
    startCamera();
  };

  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "your browser";
  };

  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Camera className="w-5 h-5 text-blue-400" />
          Camera Capture
          {permissionState === "granted" && (
            <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Allowed
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-slate-100">
          Take a photo directly from your device camera
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Warning */}
        {!isSecureContext && (
          <Alert className="bg-red-500/10 border-red-500/30">
            <Shield className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300 text-sm">
              <strong>HTTPS Required:</strong> Camera access requires a secure
              connection. Please use HTTPS or localhost.
            </AlertDescription>
          </Alert>
        )}

        {/* Camera Not Available */}
        {cameraAvailable === false && !showPermissionHelp && (
          <Alert className="bg-orange-500/10 border-orange-500/30">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-300 text-sm">
              Camera is not available on this device or browser. Please use the
              Upload Image option instead.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Permission Help */}
        {showPermissionHelp && (
          <AnimatePresence>
            <PermissionGuide browser={getBrowserName()} />
          </AnimatePresence>
        )}

        {/* Camera Active State */}
        {isCameraActive ? (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-slate-800 aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas
                ref={overlayRef as any}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ width: "100%", height: "100%" }}
              />
              <div className="absolute top-2 right-2">
                <div className="flex items-center gap-1 bg-red-500/80 px-2 py-1 rounded text-white text-xs">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  LIVE
                </div>
              </div>

              {/* Capture Guide Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm text-center">
                  Position safety equipment in frame
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={captureImage}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isProcessing}
              >
                <Check className="w-4 h-4 mr-2" />
                {isProcessing ? "Processing..." : "Capture Photo"}
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="flex-1 border-red-500/30 text-red-300 hover:bg-red-500/10"
                disabled={isProcessing}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (liveDetect) stopLiveDetection();
                  else startLiveDetection(3);
                }}
                variant={liveDetect ? undefined : "outline"}
                className={`flex-1 ${
                  liveDetect
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
                }`}
                disabled={isProcessing}
              >
                {liveDetect ? "Stop Live" : "Start Live"}
              </Button>
            </div>
            {SHOW_DEBUG && (
              <div className="mt-2 text-xs text-slate-300 bg-slate-800/40 p-2 rounded">
                <div className="font-medium text-slate-200">Debug</div>
                <div>permissionState: {permissionState}</div>
                <div>isCameraActive: {String(isCameraActive)}</div>
                <div>
                  video readyState: {videoRef.current?.readyState ?? "n/a"}
                </div>
                <div>
                  video size: {videoRef.current?.videoWidth || 0} x{" "}
                  {videoRef.current?.videoHeight || 0}
                </div>
                <div>
                  stream active:{" "}
                  {streamRef.current
                    ? String(streamRef.current.active)
                    : "false"}
                </div>
                <div>
                  video srcObject present:{" "}
                  {videoRef.current?.srcObject ? "yes" : "no"}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Camera Inactive State */
          <div className="space-y-4">
            <div className="flex items-center justify-center h-40 bg-slate-800/50 rounded-lg border-2 border-dashed border-blue-500/30">
              <div className="text-center">
                <Camera className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-slate-200 text-sm">
                  {permissionState === "denied"
                    ? "Camera Access Denied"
                    : "Camera Ready"}
                </p>
                {permissionState === "prompt" && (
                  <p className="text-slate-400 text-xs mt-1">
                    You'll be asked for permission
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={startCamera}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={
                  cameraAvailable === false || isProcessing || !isSecureContext
                }
              >
                <Camera className="w-4 h-4 mr-2" />
                {isProcessing ? "Processing..." : "Start Camera"}
              </Button>

              {showPermissionHelp && (
                <Button
                  onClick={retryPermission}
                  variant="outline"
                  className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                  disabled={isProcessing}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>

            {cameraAvailable && isSecureContext && !showPermissionHelp && (
              <p className="text-slate-300 text-xs text-center">
                Click to activate your camera and capture images
              </p>
            )}
          </div>
        )}

        {/* Additional Info */}
        {!isCameraActive && isSecureContext && (
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <p>
                  <strong className="text-slate-200">Tips:</strong>
                </p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Ensure good lighting for best detection results</li>
                  <li>Position objects clearly in the frame</li>
                  <li>Keep the camera steady when capturing</li>
                  <li>Grant camera permission when prompted</li>
                </ul>
                {showPermissionHelp && (
                  <p className="text-blue-400 mt-2">
                    📚 See <strong>CAMERA_TROUBLESHOOTING.md</strong> for
                    detailed help
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
