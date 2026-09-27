import React, { useState, useEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  onSetInitialSample?: (val: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onSetInitialSample,
}) => {
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const { displayed, done } = useTypewriter(
    'Type a number, pick a base, and watch every representation update as you go.',
    { speed: 38, startDelay: 600 }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyExample = () => {
    navigator.clipboard.writeText('1101101');
    if (onSetInitialSample) {
      onSetInitialSample('1101101');
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  return (
    <section
      id="hero"
      className="h-screen w-full flex flex-col justify-end md:justify-center pb-12 md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden relative z-10 select-text"
    >
      <div className="max-w-xl relative z-10">
        {/* 1. Blurred Intro Label */}
        <div
          className="pointer-events-none select-none mb-5 sm:mb-6 font-body text-[var(--color-ink)]"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.3,
            fontWeight: 400,
            filter: 'blur(4px)',
          }}
          aria-hidden="true"
        >
          Hey — this is the Number System Toolkit,
          <br />
          built for anyone who thinks in more than one base.
        </div>

        {/* 2. Typewriter Text */}
        <p
          className="font-body text-[var(--color-ink)] mb-5 sm:mb-6 min-h-[54px]"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.35,
            fontWeight: 400,
          }}
        >
          <span>{displayed}</span>
          {!done && (
            <span
              className="inline-block w-[2px] h-[1.1em] bg-[var(--color-ink)] align-middle ml-[2px] animate-cursor-blink"
              aria-hidden="true"
            />
          )}
        </p>

        {/* 3. Action Pills */}
        <div
          className={`flex flex-wrap gap-y-1 transition-all duration-400 ease-out ${
            pillsVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          {/* White Pill 1 */}
          <button
            type="button"
            onClick={() => onNavigate('convert')}
            className="inline-flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)] border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors duration-200 cursor-pointer font-body"
          >
            Convert a number
          </button>

          {/* White Pill 2 */}
          <button
            type="button"
            onClick={() => onNavigate('primes')}
            className="inline-flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)] border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors duration-200 cursor-pointer font-body"
          >
            Check for a prime
          </button>

          {/* White Pill 3 */}
          <button
            type="button"
            onClick={() => onNavigate('palindromes')}
            className="inline-flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)] border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors duration-200 cursor-pointer font-body"
          >
            Test a palindrome
          </button>

          {/* Signal-Outline Pill */}
          <button
            type="button"
            onClick={handleCopyExample}
            className="inline-flex items-center justify-center text-[var(--color-signal)] bg-transparent border border-[var(--color-signal)] rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap gap-2 sm:gap-3 hover:bg-[var(--color-signal)] hover:text-[var(--color-paper)] transition-colors duration-200 cursor-pointer font-mono"
            title="Click to copy 1101101 to clipboard"
          >
            <span>Try: 1101101₂</span>
            {copied ? (
              <span className="text-[11px] font-mono">Copied</span>
            ) : (
              <svg
                className="w-3 h-3 shrink-0"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Two overlapping rectangles 12x12 */}
                <rect
                  x="1"
                  y="1"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <rect
                  x="4"
                  y="4"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
