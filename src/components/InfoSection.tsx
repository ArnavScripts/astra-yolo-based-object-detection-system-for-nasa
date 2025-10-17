import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { motion } from "framer-motion";

export function InfoSection() {
  const targetClasses = [
    { name: "OxygenTank", emoji: "💨", color: "text-cyan-400" },
    { name: "NitrogenTank", emoji: "🫧", color: "text-blue-400" },
    { name: "FirstAidBox", emoji: "🩹", color: "text-red-400" },
    { name: "FireAlarm", emoji: "🚨", color: "text-orange-400" },
    { name: "SafetySwitchPanel", emoji: "🔌", color: "text-yellow-400" },
    { name: "EmergencyPhone", emoji: "📞", color: "text-green-400" },
    { name: "FireExtinguisher", emoji: "🧯", color: "text-red-500" },
  ];

  const tools = [
    { component: "Framework", description: "YOLOv8 (Ultralytics)" },
    {
      component: "Training Dataset",
      description: "1769 images from Falcon Digital Twin simulation",
    },
    {
      component: "Hardware",
      description: "GPU-accelerated training (NVIDIA CUDA)",
    },
    {
      component: "Dataset Source",
      description: "Falcon Simulation Dataset (Train, Val, Test splits)",
    },
    { component: "Classes", description: "7 safety object categories" },
    {
      component: "Deployment",
      description: "API-based inference via configured endpoint",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-slate-900/50 border-blue-500/20 hover:border-blue-500/30 transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <motion.span
                className="text-xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🎯
              </motion.span>
              <CardTitle className="text-white">Project Objective</CardTitle>
            </div>
            <CardDescription className="text-slate-100">
              To train a YOLO-based object detection model capable of detecting
              seven critical safety items in a simulated space station
              environment created using Falcon's Digital Twin platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="text-slate-100">Target Classes:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {targetClasses.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-blue-500/10 hover:border-blue-500/30 transition-all hover:shadow-md hover:shadow-blue-500/10"
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-white text-sm">{item.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-slate-900/50 border-blue-500/20 hover:border-blue-500/30 transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔧</span>
              <CardTitle className="text-white">
                Tools & Environment Setup
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tools.map((tool, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2">
                    <Badge
                      variant="outline"
                      className="border-blue-400/60 text-blue-200 w-fit"
                    >
                      {tool.component}
                    </Badge>
                    <span className="text-slate-100 text-sm">
                      {tool.description}
                    </span>
                  </div>
                  {index < tools.length - 1 && (
                    <Separator className="bg-blue-500/10" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="text-white">Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span className="text-blue-200 min-w-32">Team Name:</span>
                <span className="text-slate-50">Caption</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-200 min-w-32">Project Title:</span>
                <span className="text-slate-50">
                  ASTRA - Automated Space Tracking and Recognition Algorithm
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-200 min-w-32">Tagline:</span>
                <span className="text-slate-50 italic">
                  "AI vision ensuring safety in space."
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
