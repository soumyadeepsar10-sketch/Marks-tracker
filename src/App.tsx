/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Paper, Test, ViewMode, Theme } from './types';
import ThemeToggle from './components/ThemeToggle';
import MarksInput from './components/MarksInput';
import OverallStats from './components/OverallStats';
import IndividualGraphs from './components/IndividualGraphs';
import PerformanceTrend from './components/PerformanceTrend';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Percent, Hash, Plus, GraduationCap } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [tests, setTests] = useState<Test[]>([]);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('marks');
  const [theme, setTheme] = useState<Theme>('light');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const activeTest = tests.find(t => t.id === activeTestId) || null;

  // Load from local storage on mount
  useEffect(() => {
    const savedTests = localStorage.getItem('marks_tracker_tests');
    const savedTheme = localStorage.getItem('marks_tracker_theme') as Theme;
    
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
    
    if (savedTests) {
      const parsedTests = JSON.parse(savedTests);
      setTests(parsedTests);
      if (parsedTests.length > 0) setActiveTestId(parsedTests[0].id);
    } else {
      // First run: provide static example
      const exampleTest: Test = {
        id: 'default-test',
        name: 'Final Semester 2024',
        date: new Date().toISOString(),
        papers: [
          { id: '1', name: 'Mathematics', totalMarks: 100, obtainedMarks: 85 },
          { id: '2', name: 'Physics', totalMarks: 100, obtainedMarks: 78 },
          { id: '3', name: 'Chemistry', totalMarks: 100, obtainedMarks: 92 },
        ]
      };
      setTests([exampleTest]);
      setActiveTestId(exampleTest.id);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (tests.length > 0) {
      localStorage.setItem('marks_tracker_tests', JSON.stringify(tests));
    }
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('marks_tracker_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (tests.length <= 1) return;
      
      const currentIndex = tests.findIndex(t => t.id === activeTestId);
      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % tests.length;
        setActiveTestId(tests[nextIndex].id);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + tests.length) % tests.length;
        setActiveTestId(tests[prevIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tests, activeTestId]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleUpdateActiveTest = (updatedPapers: Paper[]) => {
    if (!activeTestId) return;
    setTests(prev => prev.map(t => t.id === activeTestId ? { ...t, papers: updatedPapers } : t));
  };

  const createNewTest = () => {
    const newTest: Test = {
      id: crypto.randomUUID(),
      name: `New Exam ${tests.length + 1}`,
      date: new Date().toISOString(),
      papers: []
    };
    setTests(prev => [...prev, newTest]);
    setActiveTestId(newTest.id);
  };

  const hasData = activeTest && activeTest.papers.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans selection:bg-indigo-500 selection:text-white" id="main-app-container">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      {/* Hero Header */}
      <header className="pt-20 pb-6 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Student Productivity</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter mb-4"
        >
          Kokanand<span className="text-zinc-400 dark:text-zinc-600"> Tracker.</span>
        </motion.h1>
      </header>

      <main className="container mx-auto max-w-5xl pb-32" id="main-content">
        {/* Test Selector Bar */}
        <div className="px-4 mb-12">
          <div 
            ref={scrollRef}
            className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
          >
            {tests.map(test => (
              <button
                key={test.id}
                onClick={() => setActiveTestId(test.id)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300",
                  activeTestId === test.id
                    ? "bg-white dark:bg-zinc-900 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-105 z-10"
                    : "bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300"
                )}
                id={`test-tab-${test.id}`}
              >
                <GraduationCap className={cn("w-5 h-5", activeTestId === test.id ? "text-indigo-500" : "text-zinc-400")} />
                <div className="text-left">
                  <p className={cn("text-xs font-bold uppercase tracking-tight", activeTestId === test.id ? "text-indigo-500" : "text-zinc-400")}>
                    {activeTestId === test.id ? 'Active Session' : 'Previous Exam'}
                  </p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[120px]">{test.name}</p>
                </div>
              </button>
            ))}
            <button
              onClick={createNewTest}
              className="flex-shrink-0 p-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-indigo-500 hover:text-indigo-500 transition-all"
              id="new-test-btn"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        <PerformanceTrend tests={tests} theme={theme} viewMode={viewMode} onViewModeChange={(mode) => setViewMode(mode)} />

        <AnimatePresence mode="popLayout">
          {activeTest && (
            <motion.div
              key={activeTestId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 mb-8">
                <input
                  type="text"
                  value={activeTest.name}
                  onChange={(e) => setTests(prev => prev.map(t => t.id === activeTestId ? { ...t, name: e.target.value } : t))}
                  className="text-3xl font-black text-zinc-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 p-0 mb-2 w-full"
                  placeholder="Test Name (e.g. Midterms)"
                />
              </div>

              {/* View Mode Toggle */}
              {hasData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mb-12 sticky top-4 z-40"
                  id="global-view-toggle"
                >
                  <div className="flex bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-[2rem] shadow-2xl shadow-indigo-500/10">
                    <button
                      onClick={() => setViewMode('marks')}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-sm font-bold transition-all",
                        viewMode === 'marks' 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                      )}
                    >
                      <Hash className="w-4 h-4" />
                      Marks
                    </button>
                    <button
                      onClick={() => setViewMode('percentage')}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-sm font-bold transition-all",
                        viewMode === 'percentage' 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                      )}
                    >
                      <Percent className="w-4 h-4" />
                      Percentage
                    </button>
                  </div>
                </motion.div>
              )}

              <MarksInput papers={activeTest.papers} setPapers={handleUpdateActiveTest} />

              {hasData && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <OverallStats papers={activeTest.papers} viewMode={viewMode} theme={theme} />
                  <IndividualGraphs papers={activeTest.papers} viewMode={viewMode} theme={theme} />
                </motion.div>
              )}

              {!hasData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-20 text-center"
                >
                  <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-500/10 flex items-center justify-center mb-8">
                    <LayoutDashboard className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h3 className="text-2xl font-bold dark:text-white mb-2">No Papers Configured for this Test</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Add your papers below to start tracking.</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/5 dark:bg-pink-500/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
