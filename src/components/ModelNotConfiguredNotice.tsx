import { Alert, AlertDescription } from "./ui/alert";
import { Settings, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface ModelNotConfiguredNoticeProps {
  onGoToSetup: () => void;
}

export function ModelNotConfiguredNotice({
  onGoToSetup,
}: ModelNotConfiguredNoticeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Alert className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-16 -mt-16"></div>

        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-blue-500/10 rounded-lg">
            <Settings className="h-6 w-6 text-blue-400" />
          </div>

          <div className="flex-1 space-y-3">
            <AlertDescription className="text-blue-100">
              <div className="space-y-3">
                <p className="text-lg">
                  <strong>Welcome to ASTRA! 🚀</strong>
                </p>
                <p className="text-sm text-blue-200">
                  To start detecting safety objects, you need to configure your
                  YOLO model endpoint first.
                </p>

                <div className="space-y-2 text-sm text-blue-200/90 bg-slate-900/30 rounded-lg p-4">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>
                      Choose your model platform (Roboflow, Hugging Face, or
                      Custom)
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Enter your model endpoint URL and API key</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Test your connection and start detecting!</span>
                  </p>
                </div>
              </div>
            </AlertDescription>

            <Button
              onClick={onGoToSetup}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure Model Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Alert>
    </motion.div>
  );
}
