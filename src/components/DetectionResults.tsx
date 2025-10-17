import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { DetectionResult } from "../App";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DetectionResultsProps {
  results: DetectionResult[] | null;
  imageUrl: string | null;
  isProcessing: boolean;
}

export function DetectionResults({
  results,
  imageUrl,
  isProcessing,
}: DetectionResultsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (imageUrl && results && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Draw bounding boxes
        results.forEach((result, index) => {
          const isHovered = hoveredIndex === index;
          // Backend sometimes returns normalized (0..1) coordinates (xywhn)
          // and sometimes absolute pixel coordinates (xyxy converted to x,y,w,h).
          // Detect which format by checking if values are <= 1 (normalized) or larger (pixels).
          const bbox = result.bbox || { x: 0, y: 0, width: 0, height: 0 };
          const looksNormalized =
            Math.max(bbox.x, bbox.y, bbox.width, bbox.height) <= 1;
          const x = looksNormalized ? bbox.x * img.width : bbox.x;
          const y = looksNormalized ? bbox.y * img.height : bbox.y;
          const width = looksNormalized ? bbox.width * img.width : bbox.width;
          const height = looksNormalized
            ? bbox.height * img.height
            : bbox.height;

          // Draw rectangle
          ctx.strokeStyle = isHovered ? "#60a5fa" : "#3b82f6";
          ctx.lineWidth = isHovered ? 4 : 2;
          ctx.strokeRect(x, y, width, height);

          // Draw label background
          const label = `${result.className} ${(
            result.confidence * 100
          ).toFixed(1)}%`;
          ctx.font = "14px sans-serif";
          const textMetrics = ctx.measureText(label);
          const textHeight = 20;

          ctx.fillStyle = isHovered ? "#60a5fa" : "#3b82f6";
          ctx.fillRect(x, y - textHeight, textMetrics.width + 10, textHeight);

          // Draw label text
          ctx.fillStyle = "#ffffff";
          ctx.fillText(label, x + 5, y - 5);

          // Draw bbox coordinates text below the box
          const coordText = `x:${Math.round(x)}, y:${Math.round(
            y
          )}, w:${Math.round(width)}, h:${Math.round(height)}`;
          ctx.font = "12px sans-serif";
          const coordMetrics = ctx.measureText(coordText);
          const coordBgHeight = 18;
          const coordBgWidth = coordMetrics.width + 10;
          // position below box if space, otherwise above
          const coordX = x;
          let coordY = y + height + coordBgHeight;
          if (coordY + coordBgHeight > img.height) {
            coordY = y - 5; // place above
          }
          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.fillRect(
            coordX,
            coordY - coordBgHeight + 4,
            coordBgWidth,
            coordBgHeight
          );
          ctx.fillStyle = "#fff";
          ctx.fillText(coordText, coordX + 5, coordY + 2);
        });
      };
      img.src = imageUrl;
    }
  }, [imageUrl, results, hoveredIndex]);

  const getClassColor = (className: string) => {
    const colors: Record<string, string> = {
      OxygenTank: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
      NitrogenTank: "bg-blue-500/20 text-blue-300 border-blue-500/50",
      FirstAidBox: "bg-red-500/20 text-red-300 border-red-500/50",
      FireAlarm: "bg-orange-500/20 text-orange-300 border-orange-500/50",
      SafetySwitchPanel:
        "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      EmergencyPhone: "bg-green-500/20 text-green-300 border-green-500/50",
      FireExtinguisher: "bg-red-600/20 text-red-400 border-red-600/50",
    };
    return (
      colors[className] || "bg-gray-500/20 text-gray-300 border-gray-500/50"
    );
  };

  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          {results && results.length > 0 ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Detection Results
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-blue-400" />
              Awaiting Detection
            </>
          )}
        </CardTitle>
        <CardDescription className="text-slate-100">
          {results && results.length > 0
            ? `Found ${results.length} safety object${
                results.length !== 1 ? "s" : ""
              }`
            : "Upload an image to see detection results"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {imageUrl && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-blue-500/20">
              <canvas ref={canvasRef} className="w-full h-auto" />
            </div>

            {results && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-white mb-3">Detected Objects:</h4>
                <ScrollArea className="h-64">
                  <div className="space-y-2 pr-4">
                    <AnimatePresence>
                      {results.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            hoveredIndex === index
                              ? "bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20"
                              : "bg-slate-800/50 border-blue-500/20 hover:border-blue-500/40"
                          }`}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getClassColor(result.className)}>
                              {result.className}
                            </Badge>
                            {(() => {
                              const conf =
                                typeof result.confidence === "number"
                                  ? result.confidence
                                  : 0;
                              const pct = Math.max(
                                0,
                                Math.min(100, Math.round(conf * 1000) / 10)
                              );
                              const pctText = `${pct.toFixed(1)}%`;
                              return (
                                <motion.span
                                  className="text-white"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.1 + 0.2 }}
                                >
                                  {pctText}
                                </motion.span>
                              );
                            })()}
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    Math.round(
                                      (result.confidence ?? 0) * 1000
                                    ) / 10
                                  )
                                )}%`,
                              }}
                              transition={{
                                delay: index * 0.1 + 0.3,
                                duration: 0.5,
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </div>
        )}

        {!imageUrl && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-blue-400/30 mx-auto mb-4" />
            <p className="text-slate-200">No image uploaded yet</p>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-slate-200">Running YOLOv8 inference...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
