import { useState } from "react";
import { Plus, Trash2, CheckCircle2, ChevronRight } from "lucide-react";
import { Paper } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface MarksInputProps {
  papers: Paper[];
  setPapers: (papers: Paper[]) => void;
}

export default function MarksInput({ papers, setPapers }: MarksInputProps) {
  const [step, setStep] = useState<'config' | 'marks'>(papers.length > 0 ? 'marks' : 'config');

  const addPaper = () => {
    const newPaper: Paper = {
      id: crypto.randomUUID(),
      name: `Paper ${papers.length + 1}`,
      totalMarks: 100,
      obtainedMarks: null
    };
    setPapers([...papers, newPaper]);
  };

  const removePaper = (id: string) => {
    setPapers(papers.filter(p => p.id !== id));
  };

  const updatePaper = (id: string, updates: Partial<Paper>) => {
    setPapers(papers.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12" id="marks-input-section">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {step === 'config' ? 'Setup Your Papers' : 'Enter Your Marks'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep(step === 'config' ? 'marks' : 'config')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
            id="toggle-step-btn"
          >
            {step === 'config' ? 'Enter Marks' : 'Configure Papers'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'config' ? (
          <motion.div
            key="config"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
            id="config-view"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers.map((paper, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={paper.id}
                  className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-widest">
                      Paper {index + 1}
                    </span>
                    <button
                      onClick={() => removePaper(paper.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                      id={`remove-paper-${paper.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Paper Name</label>
                      <input
                        type="text"
                        value={paper.name}
                        onChange={(e) => updatePaper(paper.id, { name: e.target.value })}
                        placeholder="e.g. Mathematics"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Total Marks</label>
                      <input
                        type="number"
                        value={paper.totalMarks}
                        onChange={(e) => updatePaper(paper.id, { totalMarks: Number(e.target.value) })}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.button
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addPaper}
                className="flex flex-col items-center justify-center p-5 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-indigo-500 hover:text-indigo-500 transition-all min-h-[160px]"
                id="add-paper-btn"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Add Paper</span>
              </motion.button>
            </div>

            {papers.length > 0 && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setStep('marks')}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
                  id="go-to-marks-btn"
                >
                  Continue to Marks <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="marks"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            id="marks-view"
          >
            {papers.map((paper) => (
              <div
                key={paper.id}
                className="flex items-center gap-6 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-1 truncate">
                    {paper.name}
                  </h3>
                  <p className="text-xs text-zinc-500">Max Marks: {paper.totalMarks}</p>
                </div>
                <div className="relative w-32">
                  <input
                    type="number"
                    max={paper.totalMarks}
                    value={paper.obtainedMarks ?? ''}
                    onChange={(e) => updatePaper(paper.id, { obtainedMarks: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder="Score"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-lg font-bold text-center focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
                  />
                  {paper.obtainedMarks !== null && paper.obtainedMarks > paper.totalMarks && (
                    <span className="absolute -bottom-5 right-0 text-[10px] text-red-500 font-bold uppercase">Over limit!</span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
