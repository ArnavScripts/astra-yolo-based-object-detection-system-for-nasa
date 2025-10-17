import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Settings } from 'lucide-react';
import { Badge } from './ui/badge';

interface ConfidenceThresholdProps {
  threshold: number;
  onThresholdChange: (value: number) => void;
  enabledClasses: Set<string>;
  onClassToggle: (className: string) => void;
}

const SAFETY_CLASSES = [
  { name: 'OxygenTank', emoji: '💨', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' },
  { name: 'NitrogenTank', emoji: '🫧', color: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
  { name: 'FirstAidBox', emoji: '🩹', color: 'bg-red-500/20 text-red-300 border-red-500/50' },
  { name: 'FireAlarm', emoji: '🚨', color: 'bg-orange-500/20 text-orange-300 border-orange-500/50' },
  { name: 'SafetySwitchPanel', emoji: '🔌', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' },
  { name: 'EmergencyPhone', emoji: '📞', color: 'bg-green-500/20 text-green-300 border-green-500/50' },
  { name: 'FireExtinguisher', emoji: '🧯', color: 'bg-red-600/20 text-red-400 border-red-600/50' },
];

export function ConfidenceThreshold({ 
  threshold, 
  onThresholdChange,
  enabledClasses,
  onClassToggle
}: ConfidenceThresholdProps) {
  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="w-5 h-5 text-blue-400" />
          Detection Settings
        </CardTitle>
        <CardDescription className="text-slate-100">
          Adjust confidence threshold and filter object classes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-200 text-sm">Confidence Threshold</span>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
              {(threshold * 100).toFixed(0)}%
            </Badge>
          </div>
          <Slider
            value={[threshold * 100]}
            onValueChange={(values) => onThresholdChange(values[0] / 100)}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-200">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-200 text-sm">Filter Classes</span>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
              {enabledClasses.size}/7 Active
            </Badge>
          </div>
          <div className="space-y-2">
            {SAFETY_CLASSES.map((cls) => (
              <div
                key={cls.name}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-blue-500/10 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cls.emoji}</span>
                  <div>
                    <span className="text-white text-sm block">{cls.name}</span>
                    <Badge className={`${cls.color} text-xs mt-1`}>
                      Safety Equipment
                    </Badge>
                  </div>
                </div>
                <Switch
                  checked={enabledClasses.has(cls.name)}
                  onCheckedChange={() => onClassToggle(cls.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
