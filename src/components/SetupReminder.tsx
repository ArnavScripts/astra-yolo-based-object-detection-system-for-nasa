import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Settings, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface SetupReminderProps {
  onGoToSetup: () => void;
}

export function SetupReminder({ onGoToSetup }: SetupReminderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Alert className="bg-blue-500/10 border-blue-500/30 backdrop-blur-sm">
        <AlertCircle className="h-5 w-5 text-blue-400" />
        <AlertTitle className="text-white text-lg mb-2">
          Model Configuration Required
        </AlertTitle>
        <AlertDescription className="text-slate-100 space-y-3">
          <p>
            Before you can start detecting objects, you need to connect your
            trained YOLO model.
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-slate-100">
              <strong>Quick Start:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-200 ml-2">
              <li>
                Deploy your trained model to Roboflow, Hugging Face, or a custom
                server
              </li>
              <li>Get your model's API endpoint URL</li>
              <li>Click the button below to configure your model</li>
              <li>Return here to start detecting objects!</li>
            </ol>
          </div>
          <Button
            onClick={onGoToSetup}
            className="bg-blue-600 hover:bg-blue-700 mt-3"
          >
            <Settings className="w-4 h-4 mr-2" />
            Go to Setup
          </Button>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
