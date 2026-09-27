import React from 'react';
import { ToolType } from '../types/index';

interface HeaderProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTool, onSelectTool }) => {
  return (
    <header className="border-b border-[#2D333B] bg-[#181B1E] sticky top-0 z-40">
      {/* Top Telemetry Strip */}
      <div className="border-b border-[#24282E] bg-[#111316] px-4 py-1 text-[11px] font-mono text-[#7B848F] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-[#53A69A]" />
            <span className="text-[#E0E4E8] font-bold">NST-310</span>
          </span>
          <span className="hidden sm:inline text-[#4E5661]">|</span>
          <span className="hidden sm:inline">SPEC: C++ CORE LOGIC ENGINE</span>
          <span className="hidden md:inline text-[#4E5661]">|</span>
          <span className="hidden md:inline">RADIX // PRIMES // SYMMETRY</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#4E5661]">STATUS:</span>
          <span className="text-[#53A69A] font-bold">READY</span>
        </div>
      </div>

      {/* Main Masthead & Bay Selector Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <button
            onClick={() => onSelectTool('landing')}
            className="text-left group"
          >
            <h1 className="text-lg font-bold font-sans-tech tracking-tight text-[#E0E4E8] group-hover:text-[#E5A823] transition-colors flex items-center gap-2">
              <span>NUMBER SYSTEM TOOLKIT</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 border border-[#3A414A] bg-[#22262B] text-[#53A69A]">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-[#7B848F] font-mono">
              Positional radix conversion, prime factor testing, and string symmetry scope.
            </p>
          </button>
        </div>

        {/* Station Selector Bar */}
        <nav
          className="flex items-center border border-[#2D333B] bg-[#22262B] p-0.5 text-xs font-mono w-full md:w-auto overflow-x-auto"
          aria-label="Instrument Mode Selector"
        >
          {currentTool !== 'landing' && (
            <button
              onClick={() => onSelectTool('landing')}
              className="px-3 py-1.5 text-[#7B848F] hover:text-[#E0E4E8] hover:bg-[#181B1E] transition-colors border-r border-[#2D333B]"
            >
              [STATIONS]
            </button>
          )}

          <button
            onClick={() => onSelectTool('base-conversion')}
            className={`px-3.5 py-1.5 transition-colors border-r border-[#2D333B] whitespace-nowrap ${
              currentTool === 'base-conversion'
                ? 'bg-[#181B1E] text-[#E5A823] font-bold border-b-2 border-b-[#E5A823]'
                : 'text-[#7B848F] hover:text-[#E0E4E8] hover:bg-[#181B1E]/60'
            }`}
          >
            01_RADIX_CONV
          </button>

          <button
            onClick={() => onSelectTool('prime-checker')}
            className={`px-3.5 py-1.5 transition-colors border-r border-[#2D333B] whitespace-nowrap ${
              currentTool === 'prime-checker'
                ? 'bg-[#181B1E] text-[#E5A823] font-bold border-b-2 border-b-[#E5A823]'
                : 'text-[#7B848F] hover:text-[#E0E4E8] hover:bg-[#181B1E]/60'
            }`}
          >
            02_PRIME_EVAL
          </button>

          <button
            onClick={() => onSelectTool('palindrome-checker')}
            className={`px-3.5 py-1.5 transition-colors whitespace-nowrap ${
              currentTool === 'palindrome-checker'
                ? 'bg-[#181B1E] text-[#E5A823] font-bold border-b-2 border-b-[#E5A823]'
                : 'text-[#7B848F] hover:text-[#E0E4E8] hover:bg-[#181B1E]/60'
            }`}
          >
            03_PALINDROME
          </button>
        </nav>
      </div>
    </header>
  );
};
