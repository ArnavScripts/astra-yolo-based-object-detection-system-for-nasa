import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Clock, Trash2, Eye } from "lucide-react";
import { DetectionHistoryItem } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import { listServerPredictions } from "../services/detection";
import { useEffect, useState } from "react";

interface DetectionHistoryProps {
  history: DetectionHistoryItem[];
  onSelectItem: (item: DetectionHistoryItem) => void;
  onClearHistory: () => void;
}

export function DetectionHistory({
  history,
  onSelectItem,
  onClearHistory,
}: DetectionHistoryProps) {
  const [serverPreds, setServerPreds] = useState<any[] | null>(null);

  useEffect(() => {
    // attempt to fetch server predictions but do not fail the component if backend not available
    (async () => {
      try {
        const res = await listServerPredictions();
        if (res && res.success) setServerPreds(res.predictions || []);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-blue-400" />
              Detection History
            </CardTitle>
            <CardDescription className="text-slate-100">
              {history.length} detection{history.length !== 1 ? "s" : ""} saved
            </CardDescription>
          </div>
          {history.length > 0 && (
            <Button
              onClick={onClearHistory}
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-blue-400/30 mx-auto mb-4" />
            <p className="text-slate-200">No detection history yet</p>
            <p className="text-slate-300 text-sm mt-2">
              Upload images to start tracking
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3 pr-4">
              <AnimatePresence>
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group"
                    onClick={() => onSelectItem(item)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                        <img
                          src={item.imageUrl}
                          alt="Detection"
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-1 right-1 bg-green-500/80 text-white text-xs">
                          {item.detectionCount}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-200 text-xs">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-blue-500/30 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectItem(item);
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.results.slice(0, 3).map((result, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs border-blue-500/30 text-slate-200"
                            >
                              {result.className}
                            </Badge>
                          ))}
                          {item.results.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-blue-500/30 text-slate-200"
                            >
                              +{item.results.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
        {serverPreds && serverPreds.length > 0 && (
          <div className="mt-4">
            <h4 className="text-white mb-2">Server Predictions</h4>
            <ScrollArea className="h-56">
              <div className="space-y-2 pr-4">
                {serverPreds.map((p: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-800/50 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer"
                    onClick={() => {
                      // convert server prediction into DetectionHistoryItem and pass to onSelectItem
                      const item: DetectionHistoryItem = {
                        id: `server-${p.name}-${p.timestamp}`,
                        timestamp: new Date(p.timestamp * 1000),
                        imageUrl: `${p.image}`,
                        results: (p.detections || []).map((d: any) => ({
                          className: d.class || d.className || String(d.class),
                          confidence: d.confidence || 1,
                          bbox: d.bbox || { x: 0, y: 0, width: 0, height: 0 },
                        })),
                        detectionCount: (p.detections || []).length,
                      };

                      onSelectItem(item);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-1 right-1 bg-green-500/80 text-white text-xs">
                          {(p.detections || []).length}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-200 text-xs">
                            {p.name}
                          </span>
                          <span className="text-slate-400 text-xs">
                            {new Date(p.timestamp * 1000).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(p.detections || [])
                            .slice(0, 3)
                            .map((d: any, idx: number) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs border-blue-500/30 text-slate-200"
                              >
                                {d.class || d.className || d.name}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
