import { Alert, AlertDescription } from "./ui/alert";
import { Info, Chrome, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface PermissionGuideProps {
  browser?: string;
}

export function PermissionGuide({ browser = "browser" }: PermissionGuideProps) {
  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("chrome") || userAgent.includes("edge")) {
      return {
        icon: Chrome,
        name: "Chrome/Edge",
        steps: [
          "Click the camera icon 📷 in the address bar (right side)",
          'Select "Always allow" for camera access',
          'Click "Done" and refresh the page',
          "Alternative: Settings → Privacy and security → Site settings → Camera",
        ],
      };
    } else if (userAgent.includes("firefox")) {
      return {
        icon: Globe,
        name: "Firefox",
        steps: [
          "Click the camera icon 📷 in the address bar",
          'Click the "X" next to "Blocked Temporarily"',
          'Click "Allow" when prompted again',
          "Alternative: Settings → Privacy & Security → Permissions → Camera",
        ],
      };
    } else if (userAgent.includes("safari")) {
      return {
        icon: Globe,
        name: "Safari",
        steps: [
          "Go to Safari → Settings for This Website",
          'Find "Camera" and set to "Allow"',
          "Refresh the page",
          "Alternative: Safari → Preferences → Websites → Camera",
        ],
      };
    } else {
      return {
        icon: Info,
        name: "Browser",
        steps: [
          "Look for a camera icon in the address bar",
          "Click it and allow camera access",
          "Refresh the page if needed",
          "Check your browser settings for site permissions",
        ],
      };
    }
  };

  const { icon: Icon, name, steps } = getBrowserInstructions();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Alert className="bg-blue-500/10 border-blue-500/30">
        <Icon className="h-5 w-5 text-blue-400" />
        <AlertDescription className="text-blue-200">
          <div className="space-y-3">
            <p className="text-sm">
              <strong className="text-blue-100">
                How to enable camera in {name}:
              </strong>
            </p>

            <ol className="list-decimal list-inside space-y-2 text-sm">
              {steps.map((step, index) => (
                <li key={index} className="text-blue-200">
                  {step}
                </li>
              ))}
            </ol>

            <div className="mt-4 p-3 bg-blue-900/20 rounded border border-blue-500/20">
              <p className="text-xs text-blue-300">
                <strong>Still not working?</strong>
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-blue-300">
                <li>Make sure you're using HTTPS (or localhost)</li>
                <li>Check if another app is using your camera</li>
                <li>Try closing and reopening your browser</li>
                <li>
                  Check your system camera permissions (Settings → Privacy)
                </li>
                <li>As a last resort, use the "Upload Image" option instead</li>
              </ul>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
