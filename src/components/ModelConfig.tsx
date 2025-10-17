import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Settings,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  Info,
} from "lucide-react";
import {
  getModelConfig,
  saveModelConfig,
  ModelConfig,
} from "../services/detection";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ModelConfigurationProps {
  onConfigured?: () => void;
}

const MODEL_TYPE_INFO = {
  roboflow: {
    name: "Roboflow",
    description:
      "Easy-to-use hosted object detection with automatic deployment",
    endpointExample: "https://detect.roboflow.com/your-project-id/1",
    apiKeyHelp: "Get your API key from Roboflow dashboard",
    link: "https://roboflow.com",
  },
  huggingface: {
    name: "Hugging Face",
    description: "Free inference API with thousands of pre-trained models",
    endpointExample:
      "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
    apiKeyHelp: "Get a free API token from your Hugging Face settings",
    link: "https://huggingface.co/settings/tokens",
  },
  custom: {
    name: "Custom Endpoint",
    description: "Your own deployed YOLOv8 model or any custom API",
    endpointExample: "https://your-api.com/detect",
    apiKeyHelp: "Optional - your API authentication key",
    link: null,
  },
};

export function ModelConfiguration({ onConfigured }: ModelConfigurationProps) {
  const [config, setConfig] = useState<ModelConfig>({
    modelEndpoint: "",
    apiKey: "",
    modelType: "roboflow",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const savedConfig = await getModelConfig();
      if (savedConfig && savedConfig.modelEndpoint) {
        setConfig(savedConfig);
        setIsConfigured(true);
      }
    } catch (error) {
      console.error("Failed to load config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config.modelEndpoint) {
      toast.error("Please enter a model endpoint URL");
      return;
    }

    setIsSaving(true);
    const success = await saveModelConfig(config);
    setIsSaving(false);

    if (success) {
      setIsConfigured(true);
      toast.success("Model configuration saved successfully!");
      if (onConfigured) {
        setTimeout(() => onConfigured(), 1000);
      }
    } else {
      toast.error("Failed to save model configuration");
    }
  };

  const handleTest = async () => {
    if (!config.modelEndpoint) {
      toast.error("Please configure the model endpoint first");
      return;
    }

    setIsTesting(true);
    toast.info("Testing model connection...");

    // Create a small test image (1x1 pixel red)
    const testImage =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

    try {
      const response = await fetch(
        `${window.location.origin}/.netlify/functions/server/make-server-ce7e8b87/detect`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: testImage,
            testMode: true,
          }),
        }
      );

      const result = await response.json();

      if (result.success || response.ok) {
        toast.success("✓ Model connection successful!");
      } else {
        toast.error(`Connection failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      toast.error(
        `Test failed: ${
          error instanceof Error ? error.message : "Network error"
        }`
      );
    } finally {
      setIsTesting(false);
    }
  };

  const currentModelInfo =
    MODEL_TYPE_INFO[config.modelType as keyof typeof MODEL_TYPE_INFO];

  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="w-5 h-5 text-blue-400" />
          Model Configuration
          {isConfigured && (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/50 ml-auto">
              <Check className="w-3 h-3 mr-1" />
              Configured
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-slate-100">
          Connect your YOLOv8 model to start detecting objects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-300 mt-4">Loading configuration...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Model Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="modelType" className="text-slate-100">
                Model Type
              </Label>
              <Select
                value={config.modelType}
                onValueChange={(value) =>
                  setConfig({ ...config, modelType: value as any })
                }
              >
                <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roboflow">🤖 Roboflow</SelectItem>
                  <SelectItem value="huggingface">🤗 Hugging Face</SelectItem>
                  <SelectItem value="custom">⚙️ Custom Endpoint</SelectItem>
                </SelectContent>
              </Select>

              {currentModelInfo && (
                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-slate-200 text-sm">
                    <strong>{currentModelInfo.name}:</strong>{" "}
                    {currentModelInfo.description}
                    {currentModelInfo.link && (
                      <a
                        href={currentModelInfo.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visit {currentModelInfo.name}
                      </a>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Model Endpoint */}
            <div className="space-y-2">
              <Label htmlFor="modelEndpoint" className="text-slate-100">
                Model Endpoint URL
              </Label>
              <Input
                id="modelEndpoint"
                type="url"
                placeholder={
                  currentModelInfo?.endpointExample ||
                  "https://your-model-api.com/detect"
                }
                value={config.modelEndpoint}
                onChange={(e) =>
                  setConfig({ ...config, modelEndpoint: e.target.value })
                }
                className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-slate-400"
              />
              <p className="text-slate-300 text-xs">
                Enter your {currentModelInfo?.name} endpoint URL
              </p>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-slate-100">
                API Key {config.modelType === "custom" && "(Optional)"}
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={config.apiKey}
                onChange={(e) =>
                  setConfig({ ...config, apiKey: e.target.value })
                }
                className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-slate-400"
              />
              <p className="text-slate-300 text-xs">
                {currentModelInfo?.apiKeyHelp}
              </p>
            </div>

            {/* Example Configurations */}
            <Alert className="bg-slate-800/30 border-slate-700">
              <AlertCircle className="h-4 w-4 text-slate-300" />
              <AlertDescription className="text-slate-300 text-xs space-y-2">
                <p>
                  <strong className="text-slate-200">
                    Quick Setup Examples:
                  </strong>
                </p>

                <div className="space-y-2 mt-2">
                  <div className="p-2 bg-slate-900/50 rounded">
                    <p className="text-blue-300">Roboflow:</p>
                    <code className="text-xs">
                      https://detect.roboflow.com/space-safety/1
                    </code>
                  </div>

                  <div className="p-2 bg-slate-900/50 rounded">
                    <p className="text-purple-300">Hugging Face:</p>
                    <code className="text-xs">
                      https://api-inference.huggingface.co/models/facebook/detr-resnet-50
                    </code>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving || !config.modelEndpoint}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </>
                )}
              </Button>

              <Button
                onClick={handleTest}
                disabled={isTesting || !config.modelEndpoint}
                variant="outline"
                className="border-green-500/30 text-green-300 hover:bg-green-500/10"
              >
                {isTesting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-green-400 border-t-transparent rounded-full mr-2"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
