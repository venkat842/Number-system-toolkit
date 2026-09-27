import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-black/10 bg-[var(--color-paper)] py-8 mt-12 text-xs font-mono text-black/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[var(--color-ink)] font-bold">
            Number System Toolkit — C++ to Web Port
          </div>
          <div>Browser-based computation without server dependencies.</div>
        </div>

        <div className="flex items-center gap-4 text-black/50">
          <span>React + TypeScript + Tailwind CSS</span>
          <span>•</span>
          <span>Client-side only</span>
        </div>
      </div>
    </footer>
  );
};
