import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Settings } from 'lucide-react';

interface SettingsPanelProps {
  confidenceThreshold: number;
  onConfidenceChange: (value: number) => void;
  enabledClasses: Set<string>;
  onClassToggle: (className: string) => void;
}

const SAFETY_CLASSES = [
  { name: 'OxygenTank', emoji: '💨', color: 'cyan' },
  { name: 'NitrogenTank', emoji: '🫧', color: 'blue' },
  { name: 'FirstAidBox', emoji: '🩹', color: 'red' },
  { name: 'FireAlarm', emoji: '🚨', color: 'orange' },
  { name: 'SafetySwitchPanel', emoji: '🔌', color: 'yellow' },
  { name: 'EmergencyPhone', emoji: '📞', color: 'green' },
  { name: 'FireExtinguisher', emoji: '🧯', color: 'red' },
];

export function SettingsPanel({ 
  confidenceThreshold, 
  onConfidenceChange,
  enabledClasses,
  onClassToggle 
}: SettingsPanelProps) {
  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="w-5 h-5 text-blue-400" />
          Detection Settings
        </CardTitle>
        <CardDescription className="text-slate-100">
          Configure detection parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="confidence" className="text-slate-200">
              Confidence Threshold
            </Label>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
              {(confidenceThreshold * 100).toFixed(0)}%
            </Badge>
          </div>
          <Slider
            id="confidence"
            min={0}
            max={100}
            step={5}
            value={[confidenceThreshold * 100]}
            onValueChange={([value]) => onConfidenceChange(value / 100)}
            className="w-full"
          />
          <p className="text-xs text-slate-300">
            Only show detections with confidence above this threshold
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-slate-200">Filter Classes</Label>
          <div className="space-y-2">
            {SAFETY_CLASSES.map((cls) => (
              <div
                key={cls.name}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-blue-500/10 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cls.emoji}</span>
                  <span className="text-white text-sm">{cls.name}</span>
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
