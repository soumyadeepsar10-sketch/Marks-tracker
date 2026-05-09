import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Test, Theme, ViewMode } from "../types";
import { motion } from "motion/react";
import { Hash, Percent } from "lucide-react";
import { cn } from "../lib/utils";

interface PerformanceTrendProps {
  tests: Test[];
  theme: Theme;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function PerformanceTrend({ tests, theme, viewMode, onViewModeChange }: PerformanceTrendProps) {
  const data = tests.map(test => {
    const totalMax = test.papers.reduce((acc, p) => acc + p.totalMarks, 0);
    const totalObtained = test.papers.reduce((acc, p) => acc + (p.obtainedMarks || 0), 0);
    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    
    return {
      name: test.name,
      percentage: Number(percentage.toFixed(1)),
      marks: totalObtained,
      max: totalMax
    };
  });

  if (tests.length < 2) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto px-4 mb-12" 
      id="performance-trend"
    >
      <div className="p-8 rounded-[2.5rem] bg-indigo-600 dark:bg-indigo-950/40 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Academic Journey</h3>
            <p className="text-indigo-100/70 text-sm">Tracking your growth across {tests.length} examinations</p>
          </div>

          <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => onViewModeChange('marks')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                viewMode === 'marks' 
                  ? "bg-white text-indigo-600 shadow-lg" 
                  : "text-white/60 hover:text-white"
              )}
            >
              <Hash className="w-3 h-3" />
              Marks
            </button>
            <button
              onClick={() => onViewModeChange('percentage')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                viewMode === 'percentage' 
                  ? "bg-white text-indigo-600 shadow-lg" 
                  : "text-white/60 hover:text-white"
              )}
            >
              <Percent className="w-3 h-3" />
              %
            </button>
          </div>
        </div>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                hide 
                domain={viewMode === 'percentage' ? [0, 100] : ['auto', 'auto']} 
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-white p-4 rounded-2xl shadow-2xl border border-indigo-100">
                        <p className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1">{item.name}</p>
                        <p className="text-2xl font-black text-indigo-600">
                          {viewMode === 'percentage' ? `${item.percentage}%` : item.marks}
                        </p>
                        {viewMode === 'marks' && (
                          <p className="text-[10px] font-bold text-zinc-500">Total: {item.max}</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey={viewMode === 'percentage' ? 'percentage' : 'marks'} 
                stroke="#fff" 
                strokeWidth={4}
                dot={{ fill: '#fff', strokeWidth: 2, r: 6, stroke: '#6366f1' }}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.section>
  );
}
