import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { GitCompare, Upload, Loader2 } from 'lucide-react';
import { DetectionResult } from '../App';
import { Badge } from './ui/badge';

interface ComparisonModeProps {
  onCompare: (image1: string, image2: string) => void;
  isProcessing?: boolean;
  comparisonResults?: {
    image1: { url: string; results: DetectionResult[] } | null;
    image2: { url: string; results: DetectionResult[] } | null;
  };
}

export function ComparisonMode({ onCompare, isProcessing = false, comparisonResults }: ComparisonModeProps) {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);

  const handleFileUpload = (file: File, setter: (url: string) => void) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompare = () => {
    if (image1 && image2) {
      onCompare(image1, image2);
    }
  };

  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <GitCompare className="w-5 h-5 text-blue-400" />
          Comparison Mode
        </CardTitle>
        <CardDescription className="text-slate-100">
          Compare detection results between two images side by side
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-200 text-sm mb-2">Image 1</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, setImage1);
                }}
                className="hidden"
                id="image1-upload"
              />
              <label
                htmlFor="image1-upload"
                className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-blue-500/30 rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors overflow-hidden"
              >
                {image1 ? (
                  <div className="relative w-full h-full">
                    <img src={image1} alt="Image 1" className="h-full w-full object-cover rounded-lg" />
                    {comparisonResults?.image1 && (
                      <Badge className="absolute top-2 right-2 bg-green-500/80 text-white">
                        {comparisonResults.image1.results.length} detected
                      </Badge>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-blue-400 mb-2" />
                    <span className="text-slate-200 text-sm">Upload</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-slate-200 text-sm mb-2">Image 2</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, setImage2);
                }}
                className="hidden"
                id="image2-upload"
              />
              <label
                htmlFor="image2-upload"
                className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-blue-500/30 rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors overflow-hidden"
              >
                {image2 ? (
                  <div className="relative w-full h-full">
                    <img src={image2} alt="Image 2" className="h-full w-full object-cover rounded-lg" />
                    {comparisonResults?.image2 && (
                      <Badge className="absolute top-2 right-2 bg-green-500/80 text-white">
                        {comparisonResults.image2.results.length} detected
                      </Badge>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-blue-400 mb-2" />
                    <span className="text-slate-200 text-sm">Upload</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {comparisonResults?.image1 && comparisonResults?.image2 && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
            <div className="text-center">
              <p className="text-slate-200 text-sm mb-1">Image 1</p>
              <p className="text-white text-2xl">{comparisonResults.image1.results.length}</p>
              <p className="text-slate-300 text-xs">objects</p>
            </div>
            <div className="text-center">
              <p className="text-slate-200 text-sm mb-1">Image 2</p>
              <p className="text-white text-2xl">{comparisonResults.image2.results.length}</p>
              <p className="text-slate-300 text-xs">objects</p>
            </div>
          </div>
        )}

        <Button
          onClick={handleCompare}
          disabled={!image1 || !image2 || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Comparing...
            </>
          ) : (
            <>
              <GitCompare className="w-4 h-4 mr-2" />
              Compare Images
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
