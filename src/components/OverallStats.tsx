import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Paper, ViewMode, Theme } from "../types";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface OverallStatsProps {
  papers: Paper[];
  viewMode: ViewMode;
  theme: Theme;
}

export default function OverallStats({ papers, viewMode, theme }: OverallStatsProps) {
  const totalMax = papers.reduce((acc, p) => acc + p.totalMarks, 0);
  const totalObtained = papers.reduce((acc, p) => acc + (p.obtainedMarks || 0), 0);
  const totalPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

  const chartData = papers.map((paper, index) => {
    const percentage = paper.totalMarks > 0 ? ((paper.obtainedMarks || 0) / paper.totalMarks) * 100 : 0;
    return {
      name: paper.name,
      value: viewMode === 'marks' ? (paper.obtainedMarks || 0) : Number(percentage.toFixed(1)),
      max: viewMode === 'marks' ? paper.totalMarks : 100,
      colorIndex: index
    };
  });

  const lightColors = ['#6366f1', '#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];
  const darkColors = ['#818cf8', '#f472b6', '#a78bfa', '#22d3ee', '#fbbf24', '#34d399'];

  const performanceLabel = (percent: number) => {
    if (percent >= 90) return { text: "Excellent", color: "text-emerald-500" };
    if (percent >= 75) return { text: "Good", color: "text-blue-500" };
    if (percent >= 50) return { text: "Average", color: "text-yellow-500" };
    return { text: "Needs Improvement", color: "text-red-500" };
  };

  const perf = performanceLabel(totalPercentage);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8" id="overall-stats">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          label="Total Marks"
          value={totalObtained}
          subValue={`out of ${totalMax}`}
          theme={theme}
        />
        <StatsCard
          label="Overall Percentage"
          value={`${totalPercentage.toFixed(1)}%`}
          subValue={perf.text}
          subValueColor={perf.color}
          theme={theme}
        />
        <StatsCard
          label="Papers Tracked"
          value={papers.length}
          subValue="Completed"
          theme={theme}
        />
      </div>

      <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden relative">
        {/* Neon glow effect for dark mode */}
        {theme === 'dark' && (
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 blur-[100px] -z-10" />
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Performance Summary</h3>
            <p className="text-sm text-zinc-500">Visualizing your progress across all subjects</p>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: theme === 'dark' ? '#71717a' : '#a1a1aa', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: theme === 'dark' ? '#71717a' : '#a1a1aa', fontSize: 10 }}
                domain={[0, 'auto']}
              />
              <Tooltip
                cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', radius: 10 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-700">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1 tracking-wider">{data.name}</p>
                        <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                          {data.value}{viewMode === 'percentage' ? '%' : ''}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium">
                          {viewMode === 'marks' ? `Max: ${data.max}` : 'Goal: 100%'}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                radius={[10, 10, 10, 10]}
                barSize={32}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={theme === 'light' ? lightColors[index % lightColors.length] : darkColors[index % darkColors.length]}
                    style={{ 
                      filter: theme === 'dark' ? `drop-shadow(0 0 8px ${darkColors[index % darkColors.length]}80)` : 'none' 
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function StatsCard({ label, value, subValue, subValueColor, theme }: { label: string, value: string | number, subValue: string, subValueColor?: string, theme: Theme }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-zinc-900 dark:text-white">{value}</h4>
        <span className={cn("text-xs font-medium", subValueColor || "text-zinc-500")}>
          {subValue}
        </span>
      </div>
    </motion.div>
  );
}
