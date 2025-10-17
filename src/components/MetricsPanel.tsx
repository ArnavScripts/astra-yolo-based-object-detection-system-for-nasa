import { Card, CardContent } from "./ui/card";
import { Brain, Activity, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function MetricsPanel() {
  const metrics = [
    {
      label: "Model",
      value: "YOLOv8",
      icon: Brain,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Training Images",
      value: "1769",
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Classes",
      value: "7",
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Status",
      value: "Ready",
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ y: -4 }}
        >
          <Card className="bg-slate-900/50 border-blue-500/20 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-2 rounded-lg ${metric.bgColor}`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </motion.div>
                <div>
                  <p className="text-slate-200 text-xs">{metric.label}</p>
                  <motion.p
                    className="text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {metric.value}
                  </motion.p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
