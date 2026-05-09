import { Moon, Sun } from "lucide-react";
import { Theme } from "../types";
import { motion } from "motion/react";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="fixed top-6 right-6 p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 z-50 overflow-hidden"
      id="theme-toggle"
    >
      <motion.div
        animate={{ y: theme === 'light' ? 0 : -40 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex flex-col items-center gap-4"
      >
        <Sun className="w-6 h-6" />
        <Moon className="w-6 h-6 text-indigo-400" />
      </motion.div>
    </motion.button>
  );
}
