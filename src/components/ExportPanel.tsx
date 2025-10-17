import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Download, FileJson, FileSpreadsheet, Image } from "lucide-react";
import { DetectionResult } from "../App";
import { toast } from "sonner";

interface ExportPanelProps {
  results: DetectionResult[] | null;
  imageUrl: string | null;
}

export function ExportPanel({ results, imageUrl }: ExportPanelProps) {
  const exportToJSON = () => {
    if (!results) {
      toast.error("No detection results to export");
      return;
    }

    const data = {
      timestamp: new Date().toISOString(),
      model: "YOLOv8n",
      detections: results.map((r) => ({
        class: r.className,
        confidence: r.confidence,
        bbox: r.bbox,
      })),
      summary: {
        totalDetections: results.length,
        avgConfidence: (
          results.reduce((sum, r) => sum + r.confidence, 0) / results.length
        ).toFixed(3),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `detection-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Results exported as JSON");
  };

  const exportToCSV = () => {
    if (!results) {
      toast.error("No detection results to export");
      return;
    }

    const headers = [
      "Class",
      "Confidence",
      "BBox_X",
      "BBox_Y",
      "BBox_Width",
      "BBox_Height",
    ];
    const rows = results.map((r) => [
      r.className,
      (r.confidence * 100).toFixed(2) + "%",
      r.bbox.x.toFixed(4),
      r.bbox.y.toFixed(4),
      r.bbox.width.toFixed(4),
      r.bbox.height.toFixed(4),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `detection-results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Results exported as CSV");
  };

  const exportAnnotatedImage = () => {
    if (!imageUrl) {
      toast.error("No image to export");
      return;
    }

    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `annotated-image-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Annotated image downloaded");
    });
  };

  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Download className="w-5 h-5 text-blue-400" />
          Export Results
        </CardTitle>
        <CardDescription className="text-slate-100">
          Download detection results in various formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={exportToJSON}
          disabled={!results}
          className="w-full bg-blue-600 hover:bg-blue-700 justify-start"
        >
          <FileJson className="w-4 h-4 mr-2" />
          Export as JSON
        </Button>
        <Button
          onClick={exportToCSV}
          disabled={!results}
          className="w-full bg-green-600 hover:bg-green-700 justify-start"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as CSV
        </Button>
        <Button
          onClick={exportAnnotatedImage}
          disabled={!imageUrl}
          className="w-full bg-purple-600 hover:bg-purple-700 justify-start"
        >
          <Image className="w-4 h-4 mr-2" />
          Download Annotated Image
        </Button>
      </CardContent>
    </Card>
  );
}
