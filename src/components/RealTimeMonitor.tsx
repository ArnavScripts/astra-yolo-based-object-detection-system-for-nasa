import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Activity, Wifi, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

interface RealTimeMonitorProps {
  isProcessing: boolean;
  detectionCount: number;
}

export function RealTimeMonitor({
  isProcessing,
  detectionCount,
}: RealTimeMonitorProps) {
  const [status, setStatus] = useState<"idle" | "active" | "processing">(
    "idle"
  );
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isProcessing) {
      setStatus("processing");
    } else if (detectionCount > 0) {
      setStatus("active");
    } else {
      setStatus("idle");
    }
  }, [isProcessing, detectionCount]);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "text-yellow-400";
      case "active":
        return "text-green-400";
      default:
        return "text-slate-400";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "processing":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            Processing
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
            <Wifi className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/50">
            <WifiOff className="w-3 h-3 mr-1" />
            Idle
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <motion.div
              animate={{
                rotate: status === "processing" ? 360 : 0,
              }}
              transition={{
                duration: 2,
                repeat: status === "processing" ? Infinity : 0,
                ease: "linear",
              }}
            >
              <Activity className={`w-5 h-5 ${getStatusColor()}`} />
            </motion.div>
            Real-Time Monitor
          </CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription className="text-slate-100">
          Live system status and activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/10">
            <p className="text-slate-300 text-xs mb-1">Session Uptime</p>
            <p className="text-white text-xl font-mono">
              {formatUptime(uptime)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/10">
            <p className="text-slate-300 text-xs mb-1">System Status</p>
            <p className={`text-xl capitalize ${getStatusColor()}`}>{status}</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/10">
            <p className="text-slate-300 text-xs mb-1">Active Detections</p>
            <p className="text-white text-xl">{detectionCount}</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/10">
            <p className="text-slate-300 text-xs mb-1">Model Status</p>
            <motion.p
              className="text-green-400 text-xl"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Ready
            </motion.p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
