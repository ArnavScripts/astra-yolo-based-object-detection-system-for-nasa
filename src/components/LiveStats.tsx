import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Zap, Target } from "lucide-react";

interface LiveStatsProps {
  detectionCount: number;
  totalDetections?: number;
  historyCount?: number;
}

export function LiveStats({
  detectionCount,
  totalDetections = 0,
  historyCount = 0,
}: LiveStatsProps) {
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [avgConfidence, setAvgConfidence] = useState(98.5);
  const [processingSpeed, setProcessingSpeed] = useState(42);

  useEffect(() => {
    // Simulate live statistics updates
    const interval = setInterval(() => {
      setAvgConfidence((prev) => {
        const change = (Math.random() - 0.5) * 0.5;
        return Math.max(97, Math.min(100, prev + change));
      });
      setProcessingSpeed((prev) => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(35, Math.min(50, prev + change));
      });
    }, 3001);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (detectionCount > 0) {
      setTotalProcessed((prev) => prev + 1);
    }
  }, [detectionCount]);

  const stats = [
    {
      label: "Current Detection",
      value: detectionCount,
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      suffix: "",
    },
    {
      label: "Total Detected",
      value: totalDetections,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      suffix: "",
    },
    {
      label: "Avg Confidence",
      value: avgConfidence,
      icon: Activity,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      suffix: "%",
    },
    {
      label: "History Items",
      value: historyCount,
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      suffix: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-slate-900/50 border-blue-500/20 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <motion.span
                  key={stat.value}
                  initial={{ scale: 1.2, color: "#60a5fa" }}
                  animate={{ scale: 1, color: "inherit" }}
                  className="text-white"
                >
                  {typeof stat.value === "number" &&
                  !Number.isInteger(stat.value)
                    ? stat.value.toFixed(1)
                    : stat.value}
                  {stat.suffix}
                </motion.span>
              </div>
              <p className="text-slate-200 text-xs">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
