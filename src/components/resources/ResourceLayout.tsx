import { Github } from 'lucide-react';
import type { ReactNode } from 'react';

export default function ResourceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0a0a0f]/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-end px-4">
          <a
            href="https://github.com/JithunMethusahan/AICC-Resources"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        </div>
      </header>
      {children}
    </div>
  );
}
