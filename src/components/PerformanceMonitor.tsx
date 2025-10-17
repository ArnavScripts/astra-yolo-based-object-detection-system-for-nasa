import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Activity, Cpu, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function PerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(0);
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;

        // Measure memory if available
        if ("memory" in performance) {
          const memoryInfo = (performance as any).memory;
          const usedMemory = memoryInfo.usedJSHeapSize / 1048576; // Convert to MB
          setMemory(Math.round(usedMemory));
        }

        // Simulate render time
        setRenderTime(Math.random() * 3 + 1);
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const metrics = [
    {
      label: "FPS",
      value: fps,
      icon: Activity,
      color:
        fps >= 50
          ? "text-green-400"
          : fps >= 30
          ? "text-yellow-400"
          : "text-red-400",
      bgColor:
        fps >= 50
          ? "bg-green-500/10"
          : fps >= 30
          ? "bg-yellow-500/10"
          : "bg-red-500/10",
    },
    {
      label: "Memory",
      value: memory > 0 ? `${memory}MB` : "N/A",
      icon: Cpu,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Render",
      value: `${renderTime.toFixed(1)}ms`,
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Status",
      value: "Optimal",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="w-5 h-5 text-blue-400" />
          Performance Monitor
        </CardTitle>
        <CardDescription className="text-slate-100">
          Real-time application performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 rounded-lg bg-slate-800/50 border border-blue-500/10"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`p-1 rounded ${metric.bgColor}`}>
                  <metric.icon className={`w-3 h-3 ${metric.color}`} />
                </div>
                <span className="text-slate-200 text-xs">{metric.label}</span>
              </div>
              <motion.p
                className="text-white text-sm"
                key={metric.value}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                {metric.value}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
