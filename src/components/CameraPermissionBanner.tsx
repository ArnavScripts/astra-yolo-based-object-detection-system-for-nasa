import { useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Camera, X, Info } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function CameraPermissionBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    // Check if user has already dismissed this banner
    return !localStorage.getItem("cameraPermissionBannerDismissed");
  });

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("cameraPermissionBannerDismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-4"
      >
        <Alert className="bg-blue-500/10 border-blue-500/30 relative">
          <div className="flex items-start gap-3">
            <Camera className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <AlertDescription className="text-blue-200 text-sm flex-1">
              <div className="space-y-2">
                <p>
                  <strong className="text-blue-100">
                    Camera Feature Available!
                  </strong>
                </p>
                <p>
                  When you use the camera feature, your browser will ask for
                  permission to access your camera. Click{" "}
                  <strong>"Allow"</strong> to enable live photo capture for
                  detection.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-300 mt-2">
                  <Info className="w-3 h-3" />
                  <span>
                    Your privacy is protected - camera access is only used for
                    capturing images locally.
                  </span>
                </div>
              </div>
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
