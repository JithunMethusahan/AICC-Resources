import { Github, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export default function ResourceLayout({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('aicc-theme');
    const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDark);
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('aicc-theme', next ? 'dark' : 'light');
    setDark(next);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0a0a0f]/95">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <a href="https://aicc-official.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold tracking-tight">
            <img src="https://aicc-official.org/favicon.ico" alt="AICC" className="h-7 w-7 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} /><span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent">AICC</span>
          </a>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={dark ? 'Light mode' : 'Dark mode'}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a
              href="https://github.com/JithunMethusahan/AICC-Resources"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}