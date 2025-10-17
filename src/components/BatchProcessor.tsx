import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

interface BatchProcessorProps {
  onBatchProcess: (images: string[]) => void;
  isProcessing?: boolean;
}

export function BatchProcessor({
  onBatchProcess,
  isProcessing: externalProcessing = false,
}: BatchProcessorProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    setFiles(imageFiles);
    if (imageFiles.length > 0) {
      toast.success(`${imageFiles.length} images selected`);
    }
  };

  const processBatch = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setProgress(0);

    const imageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          imageUrls.push(reader.result as string);
          setProgress(((i + 1) / files.length) * 100);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setTimeout(() => {
      onBatchProcess(imageUrls);
      setProcessing(false);
      setProgress(100);
      toast.success(`Successfully processed ${files.length} images`);
    }, 500);
  };

  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Upload className="w-5 h-5 text-blue-400" />
          Batch Processing
        </CardTitle>
        <CardDescription className="text-slate-100">
          Process multiple images at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="batch-upload"
          />
          <label
            htmlFor="batch-upload"
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-500/30 rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors"
          >
            <Upload className="w-12 h-12 text-blue-400 mb-2" />
            <span className="text-white mb-1">Select Multiple Images</span>
            <span className="text-slate-200 text-sm">
              {files.length > 0
                ? `${files.length} images selected`
                : "Click to browse"}
            </span>
          </label>
        </div>

        {processing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-slate-200 text-sm text-center">
              Processing... {Math.round(progress)}%
            </p>
          </div>
        )}

        <Button
          onClick={processBatch}
          disabled={files.length === 0 || processing || externalProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {processing || externalProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Process{" "}
              {files.length > 0
                ? `${files.length} Image${files.length !== 1 ? "s" : ""}`
                : "Images"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
