import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Paper, ViewMode, Theme } from "../types";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface IndividualGraphsProps {
  papers: Paper[];
  viewMode: ViewMode;
  theme: Theme;
}

export default function IndividualGraphs({ papers, viewMode, theme }: IndividualGraphsProps) {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 pb-24" id="individual-graphs">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-0.5 w-12 bg-indigo-500 rounded-full" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Subject Breakdown</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {papers.map((paper, index) => {
          const percentage = paper.totalMarks > 0 ? ((paper.obtainedMarks || 0) / paper.totalMarks) * 100 : 0;
          const value = viewMode === 'marks' ? (paper.obtainedMarks || 0) : Number(percentage.toFixed(1));
          const max = viewMode === 'marks' ? paper.totalMarks : 100;

          // Distinct colors for each card
          const colors = theme === 'light'
            ? ['#6366f1', '#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981']
            : ['#818cf8', '#f472b6', '#a78bfa', '#22d3ee', '#fbbf24', '#34d399'];

          const color = colors[index % colors.length];

          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={paper.id}
              className="p-6 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 truncate max-w-[200px]">
                    {paper.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-zinc-400">
                      {paper.obtainedMarks || 0} / {paper.totalMarks}
                    </span>
                    {percentage >= 50 ? (
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {percentage.toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="h-16 w-full mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ value, max }]} layout="vertical" margin={{ left: -20, right: 10 }}>
                    <XAxis type="number" domain={[0, max]} hide />
                    <YAxis type="category" hide />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl border border-white/10">
                              {payload[0].value}{viewMode === 'percentage' ? '%' : ''}
                            </div>
                          )
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[10, 10, 10, 10]}
                      barSize={12}
                      background={{ fill: theme === 'light' ? '#f4f4f5' : '#18181b', radius: 10 }}
                    >
                      <Cell
                        fill={color}
                        style={{ filter: theme === 'dark' ? `drop-shadow(0 0 5px ${color})` : 'none' }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">
                <span>0</span>
                <span>{max}{viewMode === 'percentage' ? '%' : ''}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
