import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { DetectionHistoryItem } from '../App';
import { useMemo } from 'react';

interface AnalyticsChartProps {
  history: DetectionHistoryItem[];
}

export function AnalyticsChart({ history }: AnalyticsChartProps) {
  const chartData = useMemo(() => {
    const classCount: Record<string, number> = {};
    
    history.forEach(item => {
      item.results.forEach(result => {
        classCount[result.className] = (classCount[result.className] || 0) + 1;
      });
    });

    return Object.entries(classCount).map(([name, value]) => ({
      name,
      value,
    }));
  }, [history]);

  const timelineData = useMemo(() => {
    return history
      .slice(0, 10)
      .reverse()
      .map((item, index) => ({
        name: `Detection ${index + 1}`,
        objects: item.detectionCount,
        timestamp: new Date(item.timestamp).toLocaleTimeString(),
      }));
  }, [history]);

  const COLORS = [
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#dc2626', // dark red
  ];

  if (history.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Analytics Dashboard
          </CardTitle>
          <CardDescription className="text-slate-100">
            Visual analytics of your detection results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-blue-400/30 mx-auto mb-4" />
            <p className="text-slate-200">No analytics data yet</p>
            <p className="text-slate-300 text-sm mt-2">Start detecting objects to see analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Analytics Dashboard
        </CardTitle>
        <CardDescription className="text-slate-100">
          Visual analytics of your detection results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {chartData.length > 0 && (
          <>
            <div>
              <h4 className="text-slate-100 mb-4 text-sm">Class Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '8px',
                      color: '#e0f2fe',
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Bar dataKey="value" fill="#3b82f6" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-slate-100 mb-4 text-sm">Detection Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '8px',
                        color: '#e0f2fe',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {timelineData.length > 0 && (
                <div>
                  <h4 className="text-slate-100 mb-4 text-sm">Detection Timeline</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        tick={{ fill: '#94a3b8' }}
                      />
                      <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          borderRadius: '8px',
                          color: '#e0f2fe',
                        }}
                      />
                      <Legend wrapperStyle={{ color: '#94a3b8' }} />
                      <Line 
                        type="monotone" 
                        dataKey="objects" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        name="Objects Detected"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
