import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Test, Theme, ViewMode } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, TrendingUp, BarChart2 } from "lucide-react";
import { cn } from "../lib/utils";

interface AnalyticsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  tests: Test[];
  theme: Theme;
  viewMode: ViewMode;
}

export default function AnalyticsOverlay({ isOpen, onClose, tests, theme, viewMode }: AnalyticsOverlayProps) {
  // Aggregate Journey Data
  const journeyData = tests.map(test => {
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

  // Group Paper Performance by Index/Name
  // We use paper names as the source of truth, falling back to Paper X if name is empty
  const paperNames = Array.from(new Set(tests.flatMap(t => t.papers.map((p, i) => p.name.trim() || `Paper ${i + 1}`))));
  
  const paperPerformanceData = paperNames.map(name => {
    return {
      paperName: name,
      data: tests.map(test => {
        // Find paper by name or by index-based fallback if multiple are empty
        const paper = test.papers.find((p, i) => (p.name.trim() || `Paper ${i + 1}`) === name);
        const percentage = paper && paper.totalMarks > 0 ? ((paper.obtainedMarks || 0) / paper.totalMarks) * 100 : 0;
        return {
          testName: test.name,
          value: viewMode === 'percentage' ? Number(percentage.toFixed(1)) : (paper?.obtainedMarks || 0),
          max: paper?.totalMarks || 100
        };
      })
    };
  });

  const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-zinc-50 dark:bg-black overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Advanced Analytics</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Performance Insights</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all transform hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
            {/* Main Academic Journey Re-run */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Academic Journey</h3>
                  <p className="text-zinc-500">Your aggregate progress across all sessions</p>
                </div>
              </div>

              <div className="h-[400px] w-full p-8 rounded-[3rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={journeyData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 10 }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-700">
                              <p className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1">{item.name}</p>
                              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                                {item.percentage}%
                              </p>
                              <p className="text-[10px] text-zinc-500 font-medium">Aggregate Average</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#6366f1" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Individual Paper Progress */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center">
                  <BarChart2 className="w-6 h-6 text-fuchsia-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Subject Trends</h3>
                  <p className="text-zinc-500">How each paper performs across different examinations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {paperPerformanceData.map((paper, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={paper.paperName}
                    className="p-8 rounded-[3rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-lg font-black text-zinc-900 dark:text-white truncate max-w-[200px]">
                        {paper.paperName}
                      </h4>
                      <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase text-zinc-500">
                        Trend
                      </span>
                    </div>

                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={paper.data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} />
                          <XAxis 
                            dataKey="testName" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#71717a', fontSize: 10, fontWeight: 500 }}
                            dy={10}
                          />
                          <YAxis hide domain={viewMode === 'percentage' ? [0, 100] : ['auto', 'auto']} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const item = payload[0].payload;
                                return (
                                  <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-700">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.testName}</p>
                                    <p className="text-xl font-black text-zinc-900 dark:text-white">
                                      {item.value}{viewMode === 'percentage' ? '%' : ''}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={colors[idx % colors.length]}
                            strokeWidth={3}
                            dot={{ fill: colors[idx % colors.length], r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
