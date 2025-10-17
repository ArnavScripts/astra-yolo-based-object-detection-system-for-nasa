import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DetectionUploadProps {
  onImageUpload: (imageUrl: string) => void;
  isProcessing: boolean;
  onReset: () => void;
}

export function DetectionUpload({
  onImageUpload,
  isProcessing,
  onReset,
}: DetectionUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    onReset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Upload className="w-5 h-5 text-blue-400" />
          Upload Image for Detection
        </CardTitle>
        <CardDescription className="text-slate-100">
          Upload an image to detect safety objects with YOLOv8
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-blue-500/30 hover:border-blue-500/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={isProcessing}
              />

              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-blue-500/10 rounded-full">
                    <ImageIcon className="w-12 h-12 text-blue-400" />
                  </div>
                </div>

                <div>
                  <p className="text-slate-200 mb-2">
                    Drag and drop an image here, or
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                </div>

                <p className="text-slate-300 text-xs">
                  Supports JPG, PNG, WEBP (Max 10MB)
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="relative rounded-lg overflow-hidden bg-slate-800">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                      <p className="text-white">Processing with YOLOv8...</p>
                      <p className="text-slate-300 text-sm mt-2">
                        Analyzing image
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  variant="outline"
                  className="flex-1 border-blue-500/30 text-slate-200"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New
                </Button>
                <Button
                  onClick={handleReset}
                  disabled={isProcessing}
                  variant="outline"
                  className="flex-1 border-red-500/30 text-red-300 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
