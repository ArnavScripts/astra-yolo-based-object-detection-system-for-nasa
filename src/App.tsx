import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { InfoSection } from "./components/InfoSection";
import { DetectionUpload } from "./components/DetectionUpload";
import { DetectionResults } from "./components/DetectionResults";
import { MetricsPanel } from "./components/MetricsPanel";
import { StarfieldBackground } from "./components/StarfieldBackground";
import { LiveStats } from "./components/LiveStats";
import { ExportPanel } from "./components/ExportPanel";
import { CameraCapture } from "./components/CameraCapture";
import { CameraPermissionBanner } from "./components/CameraPermissionBanner";
import { ModelNotConfiguredNotice } from "./components/ModelNotConfiguredNotice";
import { ComparisonMode } from "./components/ComparisonMode";
import { ConfidenceThreshold } from "./components/ConfidenceThreshold";
import { BatchProcessor } from "./components/BatchProcessor";
import { PerformanceMonitor } from "./components/PerformanceMonitor";
import { ModelConfiguration } from "./components/ModelConfig";
import { SetupReminder } from "./components/SetupReminder";
import { DetectionHistory } from "./components/DetectionHistory";
import { AnalyticsChart } from "./components/AnalyticsChart";
import { RealTimeMonitor } from "./components/RealTimeMonitor";
import { AIChatbot } from "./components/AIChatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  detectObjects,
  detectObjectsBatch,
  getModelConfig,
} from "./services/detection";
import { LanguageProvider, useLanguage } from "./utils/languageContext";

export interface DetectionResult {
  className: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DetectionHistoryItem {
  id: string;
  timestamp: Date;
  imageUrl: string;
  results: DetectionResult[];
  detectionCount: number;
}

function AppContent() {
  const { t } = useLanguage();
  const [detectionResults, setDetectionResults] = useState<
    DetectionResult[] | null
  >(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.25);
  const [detectionCount, setDetectionCount] = useState(0);
  const [totalDetections, setTotalDetections] = useState(0);
  const [isModelConfigured, setIsModelConfigured] = useState<boolean | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("config");
  const [detectionHistory, setDetectionHistory] = useState<
    DetectionHistoryItem[]
  >([]);
  const [enabledClasses, setEnabledClasses] = useState<Set<string>>(
    new Set([
      "OxygenTank",
      "NitrogenTank",
      "FirstAidBox",
      "FireAlarm",
      "SafetySwitchPanel",
      "EmergencyPhone",
      "FireExtinguisher",
    ])
  );
  const [batchResults, setBatchResults] = useState<
    Array<{ imageUrl: string; results: DetectionResult[] }>
  >([]);
  const [comparisonResults, setComparisonResults] = useState<{
    image1: { url: string; results: DetectionResult[] } | null;
    image2: { url: string; results: DetectionResult[] } | null;
  }>({ image1: null, image2: null });

  useEffect(() => {
    checkModelConfiguration();
    document.title =
      "ASTRA - Automated Space Tracking and Recognition Algorithm";

    // Load history from localStorage
    const savedHistory = localStorage.getItem("detectionHistory");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setDetectionHistory(
          parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }))
        );
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save history to localStorage
    if (detectionHistory.length > 0) {
      localStorage.setItem(
        "detectionHistory",
        JSON.stringify(detectionHistory)
      );
    }
  }, [detectionHistory]);

  const checkModelConfiguration = async () => {
    const config = await getModelConfig();
    setIsModelConfigured(!!(config && config.modelEndpoint));
    if (config && config.modelEndpoint) {
      setActiveTab("detection");
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    // Check if model is configured before attempting detection
    if (isModelConfigured === false) {
      toast.error(
        "Please configure your model in the Setup tab before detecting objects."
      );
      setActiveTab("config");
      return;
    }

    setUploadedImage(imageUrl);
    setIsProcessing(true);
    toast.info("Processing image with YOLOv8 model...");

    try {
      // Call real YOLO model API
      const detections = await detectObjects(imageUrl);

      // Filter by confidence threshold and enabled classes
      const filteredDetections = detections.filter(
        (r) =>
          r.confidence >= confidenceThreshold && enabledClasses.has(r.className)
      );

      setDetectionResults(filteredDetections);
      setDetectionCount(filteredDetections.length);
      setTotalDetections((prev) => prev + filteredDetections.length);
      setIsProcessing(false);

      // Add to history
      const historyItem: DetectionHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        imageUrl,
        results: filteredDetections,
        detectionCount: filteredDetections.length,
      };
      setDetectionHistory((prev) => [historyItem, ...prev].slice(0, 20)); // Keep last 20

      if (filteredDetections.length > 0) {
        toast.success(
          `Detected ${filteredDetections.length} safety object(s)!`
        );
      } else {
        toast.info("No objects detected in this image.");
      }
    } catch (error) {
      setIsProcessing(false);

      // Only log non-configuration errors
      if (
        !(error instanceof Error && error.message.includes("not configured"))
      ) {
        console.error("Detection error:", error);
      }

      // Show user-friendly error message
      if (error instanceof Error && error.message.includes("not configured")) {
        toast.error("Please configure your model in the Setup tab.");
        setActiveTab("config");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Detection failed. Please check your model configuration."
        );
      }

      setDetectionResults([]);
    }
  };

  const handleReset = () => {
    setDetectionResults(null);
    setUploadedImage(null);
    setIsProcessing(false);
    setBatchResults([]);
    setComparisonResults({ image1: null, image2: null });
    toast.info("Reset complete");
  };

  const handleBatchProcess = async (images: string[]) => {
    if (images.length === 0) return;

    // Check if model is configured before attempting batch detection
    if (isModelConfigured === false) {
      toast.error(
        "Please configure your model in the Setup tab before detecting objects."
      );
      setActiveTab("config");
      return;
    }

    setIsProcessing(true);
    toast.info(`Processing ${images.length} images...`);
    setBatchResults([]);

    try {
      const allResults: Array<{
        imageUrl: string;
        results: DetectionResult[];
      }> = [];

      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        toast.info(`Processing image ${i + 1}/${images.length}...`);

        const detections = await detectObjects(imageUrl);
        const filteredDetections = detections.filter(
          (r) =>
            r.confidence >= confidenceThreshold &&
            enabledClasses.has(r.className)
        );

        allResults.push({ imageUrl, results: filteredDetections });

        // Add to history
        const historyItem: DetectionHistoryItem = {
          id: `${Date.now()}-${i}`,
          timestamp: new Date(),
          imageUrl,
          results: filteredDetections,
          detectionCount: filteredDetections.length,
        };
        setDetectionHistory((prev) => [historyItem, ...prev].slice(0, 20));
      }

      setBatchResults(allResults);
      setIsProcessing(false);

      const totalFound = allResults.reduce(
        (sum, r) => sum + r.results.length,
        0
      );
      setTotalDetections((prev) => prev + totalFound);

      toast.success(
        `Batch processing complete! Found ${totalFound} objects across ${images.length} images.`
      );

      // Show first result
      if (allResults.length > 0) {
        setUploadedImage(allResults[0].imageUrl);
        setDetectionResults(allResults[0].results);
      }
    } catch (error) {
      setIsProcessing(false);

      // Only log non-configuration errors
      if (
        !(error instanceof Error && error.message.includes("not configured"))
      ) {
        console.error("Batch processing error:", error);
      }

      // Show user-friendly error message
      if (error instanceof Error && error.message.includes("not configured")) {
        toast.error("Please configure your model in the Setup tab.");
        setActiveTab("config");
      } else {
        toast.error("Batch processing failed");
      }
    }
  };

  const handleCompare = async (image1: string, image2: string) => {
    // Check if model is configured before attempting comparison
    if (isModelConfigured === false) {
      toast.error(
        "Please configure your model in the Setup tab before detecting objects."
      );
      setActiveTab("config");
      return;
    }

    setIsProcessing(true);
    toast.info("Comparing two images...");

    try {
      const [detections1, detections2] = await Promise.all([
        detectObjects(image1),
        detectObjects(image2),
      ]);

      const filtered1 = detections1.filter(
        (r) =>
          r.confidence >= confidenceThreshold && enabledClasses.has(r.className)
      );
      const filtered2 = detections2.filter(
        (r) =>
          r.confidence >= confidenceThreshold && enabledClasses.has(r.className)
      );

      setComparisonResults({
        image1: { url: image1, results: filtered1 },
        image2: { url: image2, results: filtered2 },
      });

      setIsProcessing(false);
      toast.success(
        `Comparison complete! Image 1: ${filtered1.length} objects, Image 2: ${filtered2.length} objects`
      );

      // Show first image in main view
      setUploadedImage(image1);
      setDetectionResults(filtered1);
    } catch (error) {
      setIsProcessing(false);

      // Only log non-configuration errors
      if (
        !(error instanceof Error && error.message.includes("not configured"))
      ) {
        console.error("Comparison error:", error);
      }

      // Show user-friendly error message
      if (error instanceof Error && error.message.includes("not configured")) {
        toast.error("Please configure your model in the Setup tab.");
        setActiveTab("config");
      } else {
        toast.error("Comparison failed");
      }
    }
  };

  const handleHistorySelect = (item: DetectionHistoryItem) => {
    setUploadedImage(item.imageUrl);
    setDetectionResults(item.results);
    setActiveTab("detection");
    toast.info("Loaded from history");
  };

  const handleClearHistory = () => {
    setDetectionHistory([]);
    localStorage.removeItem("detectionHistory");
    toast.success("History cleared");
  };

  const handleThresholdChange = (newThreshold: number) => {
    setConfidenceThreshold(newThreshold);

    // Re-filter current results if available
    if (detectionResults) {
      const filtered = detectionResults.filter(
        (r) => r.confidence >= newThreshold
      );
      setDetectionResults(filtered);
      toast.info(`Threshold updated to ${(newThreshold * 100).toFixed(0)}%`);
    }
  };

  const handleClassToggle = (className: string) => {
    setEnabledClasses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(className)) {
        newSet.delete(className);
        toast.info(`${className} disabled`);
      } else {
        newSet.add(className);
        toast.info(`${className} enabled`);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <StarfieldBackground />
      <AIChatbot />

      <div className="relative z-10">
        <Header totalDetections={totalDetections} />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 bg-slate-900/50 border border-blue-500/20 backdrop-blur-sm">
                <TabsTrigger value="config">{t.setup}</TabsTrigger>
                <TabsTrigger value="detection">{t.detection}</TabsTrigger>
                <TabsTrigger value="advanced">{t.advanced}</TabsTrigger>
                <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
                <TabsTrigger value="info">{t.about}</TabsTrigger>
              </TabsList>

              <TabsContent value="config" className="space-y-6">
                <ModelConfiguration
                  onConfigured={() => {
                    setIsModelConfigured(true);
                    setActiveTab("detection");
                  }}
                />
              </TabsContent>

              <TabsContent value="detection" className="space-y-6">
                {isModelConfigured === false ? (
                  <ModelNotConfiguredNotice
                    onGoToSetup={() => setActiveTab("config")}
                  />
                ) : (
                  <CameraPermissionBanner />
                )}

                <LiveStats
                  detectionCount={detectionCount}
                  totalDetections={totalDetections}
                  historyCount={detectionHistory.length}
                />
                <MetricsPanel />

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <DetectionUpload
                      onImageUpload={handleImageUpload}
                      isProcessing={isProcessing}
                      onReset={handleReset}
                    />

                    <DetectionResults
                      results={detectionResults}
                      imageUrl={uploadedImage}
                      isProcessing={isProcessing}
                    />
                  </div>

                  <div className="space-y-6">
                    <RealTimeMonitor
                      isProcessing={isProcessing}
                      detectionCount={detectionCount}
                    />

                    <ExportPanel
                      results={detectionResults}
                      imageUrl={uploadedImage}
                    />

                    <CameraCapture
                      onCapture={handleImageUpload}
                      isProcessing={isProcessing}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <ConfidenceThreshold
                    threshold={confidenceThreshold}
                    onThresholdChange={handleThresholdChange}
                    enabledClasses={enabledClasses}
                    onClassToggle={handleClassToggle}
                  />

                  <BatchProcessor
                    onBatchProcess={handleBatchProcess}
                    isProcessing={isProcessing}
                  />

                  <div className="lg:col-span-2">
                    <ComparisonMode
                      onCompare={handleCompare}
                      isProcessing={isProcessing}
                      comparisonResults={comparisonResults}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <LiveStats
                    detectionCount={detectionCount}
                    totalDetections={totalDetections}
                    historyCount={detectionHistory.length}
                  />
                  <MetricsPanel />

                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <AnalyticsChart history={detectionHistory} />
                      <DetectionHistory
                        history={detectionHistory}
                        onSelectItem={handleHistorySelect}
                        onClearHistory={handleClearHistory}
                      />
                    </div>
                    <div>
                      <PerformanceMonitor />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="info">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <InfoSection />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#1e293b",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            color: "#e0f2fe",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
