import React, { useState } from 'react';
import { PalindromeMode, HistoryItem } from '../types/index';
import { isValidInteger } from '../utils/validation';
import {
  isPalindromeNumber,
  isPalindromeString,
  PalindromeNumberResult,
  PalindromeStringResult,
} from '../utils/checking';

interface PalindromeCheckerProps {
  onAddHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

export const PalindromeChecker: React.FC<PalindromeCheckerProps> = ({
  onAddHistory,
}) => {
  const [mode, setMode] = useState<PalindromeMode>('number');
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [numberResult, setNumberResult] = useState<PalindromeNumberResult | null>(null);
  const [stringResult, setStringResult] = useState<PalindromeStringResult | null>(null);

  const handleModeChange = (newMode: PalindromeMode) => {
    setMode(newMode);
    setInputValue('');
    setErrorMessage(null);
    setNumberResult(null);
    setStringResult(null);
  };

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setErrorMessage(
        mode === 'number'
          ? 'Please enter an integer to check.'
          : 'Please enter a word or phrase to check.'
      );
      return;
    }

    if (mode === 'number') {
      if (!isValidInteger(trimmed)) {
        setErrorMessage('Invalid input. Digits 0-9 only.');
        setNumberResult(null);
        return;
      }

      try {
        const n = BigInt(trimmed);
        const res = isPalindromeNumber(n);
        setNumberResult(res);
        setStringResult(null);

        onAddHistory({
          tool: 'Palindrome Checker',
          summary: `Number ${res.original} is ${res.isPalindrome ? 'PALINDROME' : 'NOT PALINDROME'}`,
          detail: `Original: ${res.original} | Reversed: ${res.reversed}`,
          badgeType: res.isPalindrome ? 'success' : 'warning',
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error evaluating palindrome.';
        setErrorMessage(msg);
      }
    } else {
      // Word / Phrase mode
      const res = isPalindromeString(trimmed);
      setStringResult(res);
      setNumberResult(null);

      onAddHistory({
        tool: 'Palindrome Checker',
        summary: `"${trimmed.length > 25 ? trimmed.substring(0, 22) + '...' : trimmed}" is ${
          res.isPalindrome ? 'PALINDROME' : 'NOT PALINDROME'
        }`,
        detail: `Cleaned: "${res.cleaned}" (case & punctuation ignored)`,
        badgeType: res.isPalindrome ? 'success' : 'warning',
      });
    }
  };

  return (
    <section id="palindromes" className="py-12 border-t border-black/10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)]">
            Palindrome Checker
          </h2>
          <p className="text-sm font-body text-black/60">
            Check reflection symmetry across numbers and phrases with character-level and digit-level step-by-step breakdowns.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-black/10 pb-3">
          <button
            type="button"
            onClick={() => handleModeChange('number')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors border ${
              mode === 'number'
                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-black/15 hover:border-black/40'
            }`}
          >
            Number mode
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('text')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors border ${
              mode === 'text'
                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-black/15 hover:border-black/40'
            }`}
          >
            Word / phrase mode
          </button>
        </div>

        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label htmlFor="pal-input" className="block text-xs font-mono text-black/70 mb-1.5">
              {mode === 'number'
                ? 'Enter a number (digits 0-9):'
                : 'Enter a word or phrase (ignores case, spaces, and punctuation):'}
            </label>

            <input
              id="pal-input"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder={
                mode === 'number'
                  ? 'e.g. 12321, 1221, 45654'
                  : 'e.g. A man a plan a canal Panama, Racecar, Madam'
              }
              className="w-full px-4 py-3 rounded-none bg-[var(--color-paper)] border border-black/20 focus:border-[var(--color-ink)] font-mono text-base text-[var(--color-ink)] outline-none"
              autoComplete="off"
              spellCheck="false"
            />

            {errorMessage && (
              <p className="mt-2 text-xs font-mono text-rose-700">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[var(--color-ink)] text-[var(--color-paper)] font-body text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              Check
            </button>
            {inputValue && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  setErrorMessage(null);
                  setNumberResult(null);
                  setStringResult(null);
                }}
                className="px-4 py-2.5 border border-black/20 text-[var(--color-ink)] font-body text-sm hover:bg-black/5 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Results: Number Mode */}
        {numberResult && (
          <div className="border border-black/15 p-6 bg-white space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <span className="text-sm font-mono text-black/60">
                Number input: <strong className="text-[var(--color-ink)]">{numberResult.original}</strong>
              </span>
              <span className="text-xs font-mono text-black/40">
                Number palindrome evaluation
              </span>
            </div>

            {/* Verdict Banner */}
            <div className="flex items-baseline gap-3 p-4 bg-[var(--color-paper)] border border-black/10">
              <span className="text-sm font-mono text-black/60">Evaluation:</span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-ink)]">
                {numberResult.isPalindrome ? 'PALINDROME NUMBER' : 'NOT A PALINDROME'}
              </span>
            </div>

            {/* Clear Explanation & Reversal Step-by-Step */}
            <div className="border-t border-black/10 pt-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-heading font-bold text-[var(--color-ink)]">
                  Explanation & Digit Reversal Process
                </h3>
                <p className="text-sm font-body text-black/70 leading-relaxed">
                  {numberResult.explanation}
                </p>
              </div>

              {/* Step-by-step arithmetic digit reversal */}
              <div className="border border-black/10 p-4 bg-[var(--color-paper)] space-y-2 text-xs font-mono">
                <div className="text-black/50">// Digit Reversal Arithmetic (Modulo 10 Extraction):</div>
                <div className="space-y-1 text-black/70">
                  {numberResult.reversalSteps.map((s) => (
                    <div key={s.step} className="flex items-center gap-2">
                      <span className="text-black/40 w-6">Step {s.step}:</span>
                      <span>
                        Extracted digit <strong>{s.digit}</strong> → Cumulative reversed = <strong className="text-[var(--color-ink)]">{s.currentReversed}</strong> (remaining: {s.remaining || '0'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="p-4 border border-black/10 bg-[var(--color-paper)] text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-black/60">Forward reading:</span>
                  <span className="font-bold text-[var(--color-ink)]">{numberResult.original}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Backward reading:</span>
                  <span className="font-bold text-[var(--color-ink)]">{numberResult.reversed}</span>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-1">
                  <span className="text-black/60">Result:</span>
                  <span className="font-bold text-[var(--color-ink)]">
                    {numberResult.isPalindrome ? 'Exact Match (Symmetric)' : 'Mismatch Detected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results: Word/Phrase Mode */}
        {stringResult && (
          <div className="border border-black/15 p-6 bg-white space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <span className="text-sm font-mono text-black/60 truncate max-w-[280px] sm:max-w-md">
                Phrase input: <strong className="text-[var(--color-ink)]">"{stringResult.original}"</strong>
              </span>
              <span className="text-xs font-mono text-black/40">
                Phrase palindrome evaluation
              </span>
            </div>

            {/* Verdict Banner */}
            <div className="flex items-baseline gap-3 p-4 bg-[var(--color-paper)] border border-black/10">
              <span className="text-sm font-mono text-black/60">Evaluation:</span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-ink)]">
                {stringResult.isPalindrome ? 'PALINDROME PHRASE' : 'NOT A PALINDROME'}
              </span>
            </div>

            {/* Clear Step-by-Step Explanation */}
            <div className="border-t border-black/10 pt-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-heading font-bold text-[var(--color-ink)]">
                  Explanation & Normalization Breakdown
                </h3>
                <p className="text-sm font-body text-black/70 leading-relaxed">
                  {stringResult.explanation}
                </p>
              </div>

              {/* Normalization breakdown */}
              <div className="border border-black/10 p-4 bg-[var(--color-paper)] space-y-2 text-xs font-mono">
                <div className="text-black/50">// Text Normalization Pipeline:</div>
                <div className="space-y-1.5 text-black/70">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span>1. Original Raw Input:</span>
                    <strong className="text-[var(--color-ink)]">"{stringResult.original}"</strong>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span>2. Stripped & Lowercased:</span>
                    <strong className="text-[var(--color-ink)]">"{stringResult.cleaned || '(empty)'}"</strong>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span>3. Reversed Normalized:</span>
                    <strong className="text-[var(--color-ink)]">"{stringResult.reversedCleaned || '(empty)'}"</strong>
                  </div>
                </div>
              </div>

              {/* Two-pointer character match grid */}
              {stringResult.pairs.length > 0 && (
                <div className="border border-black/10 p-4 bg-[var(--color-paper)] space-y-2 text-xs font-mono">
                  <div className="text-black/50">// Two-Pointer Symmetry Verification:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {stringResult.pairs.map((p, idx) => (
                      <div
                        key={idx}
                        className={`p-2 border ${
                          p.matches
                            ? 'border-black/10 bg-white text-[var(--color-ink)]'
                            : 'border-rose-300 bg-rose-50 text-rose-800'
                        }`}
                      >
                        <div className="text-[10px] text-black/40">
                          Pair #{idx + 1}: [{p.leftIndex}] ↔ [{p.rightIndex}]
                        </div>
                        <div className="font-bold flex items-center justify-between mt-0.5">
                          <span>'{p.leftChar}' == '{p.rightChar}'</span>
                          <span className={p.matches ? 'text-emerald-700' : 'text-rose-600'}>
                            {p.matches ? 'Match' : 'Mismatch'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
