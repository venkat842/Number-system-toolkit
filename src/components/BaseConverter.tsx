import React, { useState, useEffect } from 'react';
import { BaseConversionMode, HistoryItem } from '../types/index';
import {
  isValidBinary,
  isValidOctal,
  isValidHex,
  isValidInteger,
} from '../utils/validation';
import {
  decimalToBinaryValue,
  decimalToOctalValue,
  decimalToHexValue,
  binaryToDecimal,
  octalToDecimal,
  hexToDecimal,
  getPositionalDecomposition,
  getDivisionSteps,
  DecompositionResult,
  DivisionStep,
} from '../utils/conversions';

interface BaseConverterProps {
  onAddHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  externalInput?: string;
}

export const BaseConverter: React.FC<BaseConverterProps> = ({
  onAddHistory,
  externalInput,
}) => {
  const [mode, setMode] = useState<BaseConversionMode>('dec-to-all');
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync external input (e.g. from copy pill)
  useEffect(() => {
    if (externalInput) {
      if (isValidBinary(externalInput)) {
        setMode('bin-to-dec');
      }
      setInputValue(externalInput);
    }
  }, [externalInput]);

  // Results state
  const [decResults, setDecResults] = useState<{
    decimal: string;
    binary: string;
    octal: string;
    hexadecimal: string;
    binDecomp: DecompositionResult;
    octDecomp: DecompositionResult;
    hexDecomp: DecompositionResult;
    binDivSteps: DivisionStep[];
    octDivSteps: DivisionStep[];
    hexDivSteps: DivisionStep[];
  } | null>(null);

  const [singleResult, setSingleResult] = useState<{
    fromBase: string;
    baseNumber: 2 | 8 | 16;
    input: string;
    decimal: string;
    decomp: DecompositionResult;
  } | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleModeChange = (newMode: BaseConversionMode) => {
    setMode(newMode);
    setInputValue('');
    setErrorMessage(null);
    setDecResults(null);
    setSingleResult(null);
  };

  const handleConvert = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a value to convert.');
      return;
    }

    try {
      if (mode === 'dec-to-all') {
        if (!isValidInteger(trimmed)) {
          setErrorMessage('Invalid decimal number. Please enter a non-negative integer (0-9).');
          setDecResults(null);
          return;
        }

        const n = BigInt(trimmed);
        const bin = decimalToBinaryValue(n);
        const oct = decimalToOctalValue(n);
        const hex = decimalToHexValue(n);

        const binDecomp = getPositionalDecomposition(bin, 2);
        const octDecomp = getPositionalDecomposition(oct, 8);
        const hexDecomp = getPositionalDecomposition(hex, 16);

        const binDivSteps = getDivisionSteps(n, 2);
        const octDivSteps = getDivisionSteps(n, 8);
        const hexDivSteps = getDivisionSteps(n, 16);

        setDecResults({
          decimal: trimmed,
          binary: bin,
          octal: oct,
          hexadecimal: hex,
          binDecomp,
          octDecomp,
          hexDecomp,
          binDivSteps,
          octDivSteps,
          hexDivSteps,
        });
        setSingleResult(null);

        onAddHistory({
          tool: 'Base Conversion',
          summary: `Decimal ${trimmed} = Bin:${bin} | Oct:${oct} | Hex:${hex}`,
          detail: `Decimal ${trimmed} converted to all bases`,
          badgeType: 'success',
        });
      } else if (mode === 'bin-to-dec') {
        if (!isValidBinary(trimmed)) {
          setErrorMessage('Invalid binary digits. Digits must be 0 or 1 only.');
          setSingleResult(null);
          return;
        }

        const dec = binaryToDecimal(trimmed);
        const decomp = getPositionalDecomposition(trimmed, 2);

        setSingleResult({
          fromBase: 'Binary (Base 2)',
          baseNumber: 2,
          input: trimmed,
          decimal: dec,
          decomp,
        });
        setDecResults(null);

        onAddHistory({
          tool: 'Base Conversion',
          summary: `Binary ${trimmed} = Decimal ${dec}`,
          detail: `Binary to Decimal conversion`,
          badgeType: 'success',
        });
      } else if (mode === 'oct-to-dec') {
        if (!isValidOctal(trimmed)) {
          setErrorMessage('Invalid octal digits. Digits must be 0 to 7 only.');
          setSingleResult(null);
          return;
        }

        const dec = octalToDecimal(trimmed);
        const decomp = getPositionalDecomposition(trimmed, 8);

        setSingleResult({
          fromBase: 'Octal (Base 8)',
          baseNumber: 8,
          input: trimmed,
          decimal: dec,
          decomp,
        });
        setDecResults(null);

        onAddHistory({
          tool: 'Base Conversion',
          summary: `Octal ${trimmed} = Decimal ${dec}`,
          detail: `Octal to Decimal conversion`,
          badgeType: 'success',
        });
      } else if (mode === 'hex-to-dec') {
        if (!isValidHex(trimmed)) {
          setErrorMessage('Invalid hexadecimal digits. Use digits 0-9 and A-F only.');
          setSingleResult(null);
          return;
        }

        const upperHex = trimmed.toUpperCase();
        const dec = hexToDecimal(upperHex);
        const decomp = getPositionalDecomposition(upperHex, 16);

        setSingleResult({
          fromBase: 'Hexadecimal (Base 16)',
          baseNumber: 16,
          input: upperHex,
          decimal: dec,
          decomp,
        });
        setDecResults(null);

        onAddHistory({
          tool: 'Base Conversion',
          summary: `Hex ${upperHex} = Decimal ${dec}`,
          detail: `Hexadecimal to Decimal conversion`,
          badgeType: 'success',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error in conversion.';
      setErrorMessage(msg);
    }
  };

  return (
    <section id="convert" className="py-12 border-t border-black/10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)]">
            Base Conversion
          </h2>
          <p className="text-sm font-body text-black/60">
            Convert numbers across Decimal, Binary, Octal, and Hexadecimal representations with step-by-step mathematical explanations.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-black/10 pb-3">
          <button
            type="button"
            onClick={() => handleModeChange('dec-to-all')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors border ${
              mode === 'dec-to-all'
                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-black/15 hover:border-black/40'
            }`}
          >
            Decimal to all
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('bin-to-dec')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors border ${
              mode === 'bin-to-dec'
                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-black/15 hover:border-black/40'
            }`}
          >
            Binary to decimal
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('oct-to-dec')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors border ${
              mode === 'oct-to-dec'
                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-black/15 hover:border-black/40'
            }`}
          >
            Octal to decimal
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('hex-to-dec')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors border ${
              mode === 'hex-to-dec'
                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-black/15 hover:border-black/40'
            }`}
          >
            Hex to decimal
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleConvert} className="space-y-4">
          <div>
            <label htmlFor="base-input" className="block text-xs font-mono text-black/70 mb-1.5">
              {mode === 'dec-to-all' && 'Decimal input (digits 0-9):'}
              {mode === 'bin-to-dec' && 'Binary input (0 and 1 only):'}
              {mode === 'oct-to-dec' && 'Octal input (digits 0-7):'}
              {mode === 'hex-to-dec' && 'Hexadecimal input (0-9, A-F):'}
            </label>

            <input
              id="base-input"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder={
                mode === 'dec-to-all'
                  ? 'e.g. 42, 255'
                  : mode === 'bin-to-dec'
                  ? 'e.g. 101010, 1101101'
                  : mode === 'oct-to-dec'
                  ? 'e.g. 52, 377'
                  : 'e.g. 2A, FF'
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
              Convert
            </button>
            {inputValue && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  setErrorMessage(null);
                  setDecResults(null);
                  setSingleResult(null);
                }}
                className="px-4 py-2.5 border border-black/20 text-[var(--color-ink)] font-body text-sm hover:bg-black/5 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Results: Simultaneous Decimal to All */}
        {decResults && (
          <div className="border border-black/15 p-6 bg-white space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <span className="text-sm font-mono text-black/60">
                Decimal input: <strong className="text-[var(--color-ink)]">{decResults.decimal}</strong>
              </span>
              <span className="text-xs font-mono text-black/40">
                Base conversion output
              </span>
            </div>

            {/* 3 Result Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-black/10 p-4 space-y-1">
                <div className="flex justify-between text-xs font-mono text-black/60">
                  <span>Binary (base 2)</span>
                  <button
                    onClick={() => handleCopy(decResults.binary, 'bin')}
                    className="text-[11px] underline hover:opacity-60"
                  >
                    {copiedKey === 'bin' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="font-mono text-lg font-bold text-[var(--color-ink)] break-all select-all">
                  {decResults.binary}
                </div>
              </div>

              <div className="border border-black/10 p-4 space-y-1">
                <div className="flex justify-between text-xs font-mono text-black/60">
                  <span>Octal (base 8)</span>
                  <button
                    onClick={() => handleCopy(decResults.octal, 'oct')}
                    className="text-[11px] underline hover:opacity-60"
                  >
                    {copiedKey === 'oct' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="font-mono text-lg font-bold text-[var(--color-ink)] break-all select-all">
                  {decResults.octal}
                </div>
              </div>

              <div className="border border-black/10 p-4 space-y-1">
                <div className="flex justify-between text-xs font-mono text-black/60">
                  <span>Hex (base 16)</span>
                  <button
                    onClick={() => handleCopy(decResults.hexadecimal, 'hex')}
                    className="text-[11px] underline hover:opacity-60"
                  >
                    {copiedKey === 'hex' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="font-mono text-lg font-bold text-[var(--color-ink)] break-all select-all">
                  {decResults.hexadecimal}
                </div>
              </div>
            </div>

            {/* Clear Step-by-Step Explanations Panel */}
            <div className="border-t border-black/10 pt-5 space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-heading font-bold text-[var(--color-ink)]">
                  Explanation & Step-by-Step Derivation
                </h3>
                <p className="text-xs font-body text-black/60">
                  To convert decimal <span className="font-mono">{decResults.decimal}</span> into another base, repeatedly divide by the target base and record the remainders in reverse order (least significant digit to most significant digit).
                </p>
              </div>

              {/* Binary Derivation */}
              <div className="border border-black/10 p-4 bg-[var(--color-paper)] space-y-2">
                <div className="text-xs font-mono font-bold text-[var(--color-ink)] flex items-center justify-between">
                  <span>1. Decimal to Binary (Divide by 2)</span>
                  <span className="text-black/50 font-normal">Result: {decResults.binary}₂</span>
                </div>
                <div className="space-y-1 text-xs font-mono text-black/70">
                  {decResults.binDivSteps.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-black/40 text-[11px] w-6">#{idx + 1}</span>
                      <span>
                        {s.quotientBefore.toString()} ÷ 2 = {s.quotientAfter.toString()} remainder <strong className="text-[var(--color-ink)]">{s.remainder}</strong>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-xs font-body text-black/60 pt-1 border-t border-black/10">
                  Reading the remainders from bottom to top yields: <strong className="font-mono text-[var(--color-ink)]">{decResults.binary}₂</strong>.
                </div>
              </div>

              {/* Octal Derivation */}
              <div className="border border-black/10 p-4 bg-[var(--color-paper)] space-y-2">
                <div className="text-xs font-mono font-bold text-[var(--color-ink)] flex items-center justify-between">
                  <span>2. Decimal to Octal (Divide by 8)</span>
                  <span className="text-black/50 font-normal">Result: {decResults.octal}₈</span>
                </div>
                <div className="space-y-1 text-xs font-mono text-black/70">
                  {decResults.octDivSteps.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-black/40 text-[11px] w-6">#{idx + 1}</span>
                      <span>
                        {s.quotientBefore.toString()} ÷ 8 = {s.quotientAfter.toString()} remainder <strong className="text-[var(--color-ink)]">{s.remainder}</strong>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-xs font-body text-black/60 pt-1 border-t border-black/10">
                  Reading the remainders from bottom to top yields: <strong className="font-mono text-[var(--color-ink)]">{decResults.octal}₈</strong>.
                </div>
              </div>

              {/* Hexadecimal Derivation */}
              <div className="border border-black/10 p-4 bg-[var(--color-paper)] space-y-2">
                <div className="text-xs font-mono font-bold text-[var(--color-ink)] flex items-center justify-between">
                  <span>3. Decimal to Hexadecimal (Divide by 16)</span>
                  <span className="text-black/50 font-normal">Result: {decResults.hexadecimal}₁₆</span>
                </div>
                <div className="space-y-1 text-xs font-mono text-black/70">
                  {decResults.hexDivSteps.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-black/40 text-[11px] w-6">#{idx + 1}</span>
                      <span>
                        {s.quotientBefore.toString()} ÷ 16 = {s.quotientAfter.toString()} remainder {s.remainder}
                        {s.remainder >= 10 ? ` (Hex: '${s.remainderChar}')` : ''}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-xs font-body text-black/60 pt-1 border-t border-black/10">
                  Reading the hex remainders from bottom to top yields: <strong className="font-mono text-[var(--color-ink)]">{decResults.hexadecimal}₁₆</strong>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results: Single Radix to Decimal */}
        {singleResult && (
          <div className="border border-black/15 p-6 bg-white space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <span className="text-sm font-mono text-black/60">
                {singleResult.fromBase} input: <strong className="text-[var(--color-ink)]">{singleResult.input}</strong>
              </span>
              <button
                onClick={() => handleCopy(singleResult.decimal, 'single')}
                className="text-xs font-mono underline hover:opacity-60"
              >
                {copiedKey === 'single' ? 'Copied' : 'Copy decimal'}
              </button>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-sm font-mono text-black/60">Decimal equivalent:</span>
              <span className="font-mono text-3xl font-bold text-[var(--color-ink)] select-all">
                {singleResult.decimal}
              </span>
            </div>

            {/* Positional Expansion Explanation */}
            <div className="border-t border-black/10 pt-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-heading font-bold text-[var(--color-ink)]">
                  Explanation & Positional Place-Value Expansion
                </h3>
                <p className="text-xs font-body text-black/60">
                  In positional notation, each digit's value is multiplied by the base raised to its position index (counting from 0 on the right):
                </p>
              </div>

              {/* Place-value grid */}
              <div className="overflow-x-auto">
                <div className="inline-flex gap-2 p-3 bg-[var(--color-paper)] border border-black/10">
                  {singleResult.decomp.terms.map((t, idx) => (
                    <div key={idx} className="flex flex-col items-center px-3 py-1.5 border-r border-black/10 last:border-r-0 min-w-[70px]">
                      <span className="text-[10px] font-mono text-black/50">{singleResult.baseNumber}^{t.placeIndex}</span>
                      <span className="text-xs font-mono text-black/60 font-bold">({t.baseWeight.toString()})</span>
                      <span className="text-base font-mono font-bold text-[var(--color-ink)] my-1">{t.digitChar}</span>
                      <span className="text-[11px] font-mono text-black/70">{t.digitValue.toString()} × {t.baseWeight.toString()}</span>
                      <span className="text-xs font-mono font-bold text-[var(--color-ink)] mt-0.5">={t.evaluatedTerm.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mathematical Equation */}
              <div className="p-3 bg-[var(--color-paper)] border border-black/10 font-mono text-xs text-black/80 space-y-1.5">
                <div className="text-black/50 text-[11px]">// Expanded polynomial formula:</div>
                <div className="font-bold">{singleResult.decomp.formulaString}</div>
                <div className="text-black/60">{singleResult.decomp.expandedSumString}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
