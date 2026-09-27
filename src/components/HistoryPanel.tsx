import React from 'react';
import { HistoryItem } from '../types/index';

interface HistoryPanelProps {
  history: HistoryItem[];
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return (
      <div className="border border-black/15 p-4 bg-white text-xs font-mono text-black/50 flex items-center justify-between">
        <span>Session history: No operations recorded yet.</span>
        <span className="text-[11px] text-black/40">Last 5 operations</span>
      </div>
    );
  }

  return (
    <div className="border border-black/15 bg-white space-y-0 text-xs font-mono">
      <div className="p-3 border-b border-black/10 flex items-center justify-between">
        <span className="text-black/80 font-bold">
          Session history ({history.length}/5)
        </span>
        <button
          onClick={onClearHistory}
          className="text-black/50 hover:text-black underline cursor-pointer text-[11px]"
        >
          Clear history
        </button>
      </div>

      <div className="divide-y divide-black/10">
        {history.map((item, idx) => (
          <div
            key={item.id}
            className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-black/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-black/40 text-[11px]">
                #{idx + 1}
              </span>
              <span className="text-black/60 font-medium text-[11px] border border-black/10 px-1.5 py-0.5 bg-[var(--color-paper)]">
                {item.tool}
              </span>
              <div className="min-w-0 flex-1 truncate">
                <span className="font-bold text-[var(--color-ink)]">
                  {item.summary}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-black/40 self-end sm:self-auto">
              {item.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
