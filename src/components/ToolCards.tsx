import React from 'react';
import { ToolType } from '../types/index';

interface ToolCardsProps {
  onSelectTool: (tool: ToolType) => void;
}

export const ToolCards: React.FC<ToolCardsProps> = ({ onSelectTool }) => {
  const stations = [
    {
      id: 'base-conversion' as ToolType,
      code: 'STATION_01',
      title: 'Base Conversion Register',
      spec: 'RADIX 2 / 8 / 10 / 16 POLYNOMIAL ENGINE',
      description:
        'Converts integers across Decimal, Binary, Octal, and Hexadecimal representations with positional place-value polynomial decomposition.',
      samplePreview: '42_10 = 101010_2 = 52_8 = 2A_16',
      subroutines: [
        'decimalToBinaryValue(n)',
        'decimalToOctalValue(n)',
        'decimalToHexValue(n)',
        'radixToDecimal(s, b)',
      ],
      tag: 'RADIX_CONVERTER',
    },
    {
      id: 'prime-checker' as ToolType,
      code: 'STATION_02',
      title: 'Prime Number Evaluator',
      spec: 'O(√N) TRIAL FACTOR TESTER',
      description:
        'Determines primality for non-negative integers using square-root limit trial division with immediate composite factor identification.',
      samplePreview: 'isPrime(97) -> TRUE [TRIAL LIMIT <= 9]',
      subroutines: [
        'isPrime(long long n)',
        'approxSqrt(n)',
        'compositeFactorExtractor(n)',
      ],
      tag: 'PRIME_CHECKER',
    },
    {
      id: 'palindrome-checker' as ToolType,
      code: 'STATION_03',
      title: 'Palindrome Symmetry Scope',
      spec: 'INTEGER & STRING MIRROR REGISTER',
      description:
        'Analyzes bilateral reflection symmetry for raw numeric values and normalized alphanumeric text (case & punctuation insensitive).',
      samplePreview: 'isPalindrome("A man...") -> MATCH',
      subroutines: [
        'isPalindrome(long long n)',
        'isPalindromeString(string s)',
        'bilateralPairScanner(s)',
      ],
      tag: 'SYMMETRY_SCOPE',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Workbench Station Overview Bar */}
      <div className="border border-[#2D333B] bg-[#22262B] p-4 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[#53A69A] font-bold">INSTRUMENT CONSOLE</span>
          <span className="text-[#7B848F] ml-2">// SELECT FUNCTION BAY TO ENGAGE</span>
        </div>
        <div className="text-[#7B848F] flex items-center gap-4">
          <span>ALL COMPUTATIONS CLIENT-SIDE</span>
          <span className="text-[#4E5661]">|</span>
          <span className="text-[#E5A823]">3 OPERATIONAL MODES</span>
        </div>
      </div>

      {/* 3 Modular Station Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <div
            key={station.id}
            onClick={() => onSelectTool(station.id)}
            className="border border-[#2D333B] bg-[#22262B] hover:border-[#53A69A] transition-colors cursor-pointer flex flex-col justify-between group"
          >
            {/* Header Plate */}
            <div className="p-4 border-b border-[#2D333B] bg-[#1C2024] flex items-center justify-between font-mono text-xs">
              <span className="text-[#E5A823] font-bold">{station.code}</span>
              <span className="text-[#7B848F] text-[10px] px-1.5 py-0.5 border border-[#2D333B] bg-[#181B1E]">
                {station.tag}
              </span>
            </div>

            {/* Station Body */}
            <div className="p-5 space-y-4 flex-1">
              <div>
                <h2 className="text-base font-bold font-sans-tech text-[#E0E4E8] group-hover:text-[#E5A823] transition-colors">
                  {station.title}
                </h2>
                <div className="text-[11px] font-mono text-[#53A69A] mt-0.5">
                  {station.spec}
                </div>
              </div>

              <p className="text-xs text-[#A8B2BD] leading-relaxed">
                {station.description}
              </p>

              {/* Recessed Sample Readout */}
              <div className="bg-[#0E1012] border border-[#2D333B] p-3 font-mono text-xs text-[#E5A823]">
                <div className="text-[10px] text-[#7B848F] mb-1">// SAMPLE COMPUTATION</div>
                <div className="truncate">{station.samplePreview}</div>
              </div>

              {/* Subroutine List */}
              <div className="space-y-1 pt-1">
                <div className="text-[10px] font-mono text-[#7B848F]">// C++ SUBROUTINES</div>
                {station.subroutines.map((sub, i) => (
                  <div key={i} className="text-[11px] font-mono text-[#7B848F] truncate">
                    › <span className="text-[#C5CDD6]">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engage Trigger Button */}
            <div className="p-4 border-t border-[#2D333B] bg-[#1C2024]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTool(station.id);
                }}
                className="w-full py-2 px-3 bg-[#2D333B] group-hover:bg-[#E5A823] text-[#E0E4E8] group-hover:text-[#0E1012] font-mono font-bold text-xs transition-colors flex items-center justify-between"
              >
                <span>[ ENGAGE STATION ]</span>
                <span className="font-mono">SELECT</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
