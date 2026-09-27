import React, { useState } from 'react';
import { HistoryItem } from '../types/index';
import { isValidInteger } from '../utils/validation';
import { isPrime, PrimeCheckResult } from '../utils/checking';

interface PrimeCheckerProps {
  onAddHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

export const PrimeChecker: React.FC<PrimeCheckerProps> = ({ onAddHistory }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<PrimeCheckResult | null>(null);

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setErrorMessage('Please enter an integer to check.');
      return;
    }

    if (!isValidInteger(trimmed)) {
      setErrorMessage('Invalid input. Please enter a non-negative integer (0-9).');
      setResult(null);
      return;
    }

    try {
      const n = BigInt(trimmed);
      const res = isPrime(n);
      setResult(res);

      onAddHistory({
        tool: 'Prime Checker',
        summary: `${trimmed} is ${res.isPrime ? 'PRIME' : 'NOT PRIME'}`,
        detail: res.reason,
        badgeType: res.isPrime ? 'success' : 'warning',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error checking primality.';
      setErrorMessage(msg);
    }
  };

  return (
    <section id="primes" className="py-12 border-t border-black/10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)]">
            Prime Checker
          </h2>
          <p className="text-sm font-body text-black/60">
            Check whether a number is prime or composite with full mathematical explanation and trial divisor breakdown.
          </p>
        </div>

        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label htmlFor="prime-input" className="block text-xs font-mono text-black/70 mb-1.5">
              Enter a number (non-negative integer):
            </label>

            <input
              id="prime-input"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="e.g. 2, 17, 97, 100, 104729"
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
                  setResult(null);
                }}
                className="px-4 py-2.5 border border-black/20 text-[var(--color-ink)] font-body text-sm hover:bg-black/5 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Results Panel */}
        {result && (
          <div className="border border-black/15 p-6 bg-white space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <span className="text-sm font-mono text-black/60">
                Input: <strong className="text-[var(--color-ink)]">{result.checkedNumber}</strong>
              </span>
              <span className="text-xs font-mono text-black/40">
                Primality evaluation result
              </span>
            </div>

            {/* Verdict Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-2 p-4 bg-[var(--color-paper)] border border-black/10">
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-mono text-black/60">Evaluation:</span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-ink)]">
                  {result.isPrime ? 'PRIME NUMBER' : 'NOT PRIME (COMPOSITE)'}
                </span>
              </div>
              <div className="text-xs font-mono text-black/50">
                Square root limit: ⌊√N⌋ = {result.sqrtLimit}
              </div>
            </div>

            {/* Clear Step-by-Step Explanation Panel */}
            <div className="border-t border-black/10 pt-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-heading font-bold text-[var(--color-ink)]">
                  Mathematical Explanation & Proof
                </h3>
                <p className="text-sm font-body text-black/70 leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              {/* Factor breakdown if composite */}
              {result.firstDivisor && (
                <div className="p-4 border border-black/10 bg-[var(--color-paper)] space-y-2 text-xs font-mono">
                  <div className="text-black/50">// Factorization Proof:</div>
                  <div className="text-sm font-bold text-[var(--color-ink)]">
                    {result.checkedNumber} = {result.firstDivisor} × {result.complementFactor}
                  </div>
                  <div className="text-black/60 font-body">
                    Because {result.checkedNumber} is divisible by {result.firstDivisor} (with remainder 0), it has more than two positive divisors, disproving primality.
                  </div>
                </div>
              )}

              {/* Proof details if prime */}
              {result.isPrime && (
                <div className="p-4 border border-black/10 bg-[var(--color-paper)] space-y-2 text-xs font-mono">
                  <div className="text-black/50">// Trial Division Verification Details:</div>
                  <div className="text-black/70 font-body leading-relaxed">
                    Checked candidate divisors: <span className="font-mono font-bold text-[var(--color-ink)]">{result.testedCandidates.join(', ')}{result.testedCount > result.testedCandidates.length ? '...' : ''}</span> (total {result.testedCount} trial divisions).
                  </div>
                  <div className="text-black/60 font-body">
                    None of the integers up to ⌊√{result.checkedNumber}⌋ = {result.sqrtLimit} divide {result.checkedNumber} evenly. Therefore, {result.checkedNumber} is strictly prime.
                  </div>
                </div>
              )}

              {/* Educational Note */}
              <div className="p-3 border border-black/5 bg-black/[0.02] text-xs font-body text-black/60 space-y-1">
                <strong>Why trial division stops at √N:</strong> If N has a composite divisor pair a × b = N, at least one factor must be ≤ √N. If both were &gt; √N, their product would exceed N. Thus, testing divisors up to ⌊√N⌋ is mathematically sufficient to prove primality.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
