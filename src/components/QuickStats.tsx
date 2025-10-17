import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";
import { Activity, Image, Clock, TrendingUp } from "lucide-react";

interface QuickStatsProps {
  totalDetections: number;
  totalImages: number;
  avgConfidence: number;
  avgDetectionsPerImage: number;
}

export function QuickStats({
  totalDetections,
  totalImages,
  avgConfidence,
  avgDetectionsPerImage,
}: QuickStatsProps) {
  const stats = [
    {
      label: "Total Detections",
      value: totalDetections.toLocaleString(),
      icon: Activity,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      label: "Images Processed",
      value: totalImages.toLocaleString(),
      icon: Image,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Avg. Confidence",
      value: `${(avgConfidence * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Avg. Per Image",
      value: avgDetectionsPerImage.toFixed(1),
      icon: Clock,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-blue-300/60 text-xs">{stat.label}</p>
                  <p className="text-white text-lg">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
