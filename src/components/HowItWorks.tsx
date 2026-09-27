import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 border-t border-black/10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)]">
            How it works
          </h2>
          <p className="text-sm font-body text-black/60">
            A look at the underlying logic ported from the original C++ console application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Base Conversion */}
          <div className="border border-black/15 p-5 bg-white space-y-2">
            <h3 className="font-heading font-bold text-base text-[var(--color-ink)]">
              Base Conversion
            </h3>
            <p className="text-xs font-body text-black/70 leading-relaxed">
              Positional notation represents numbers as sums of powers of a given radix base b:
            </p>
            <div className="font-mono text-xs text-black/80 bg-[var(--color-paper)] p-2.5 border border-black/10">
              N = ∑ (dᵢ × bⁱ)
            </div>
            <p className="text-xs font-body text-black/60 leading-relaxed">
              Converts to binary (base 2), octal (base 8), and hexadecimal (base 16) using successive division and remainder accumulation.
            </p>
          </div>

          {/* Prime Checking */}
          <div className="border border-black/15 p-5 bg-white space-y-2">
            <h3 className="font-heading font-bold text-base text-[var(--color-ink)]">
              Prime Checking
            </h3>
            <p className="text-xs font-body text-black/70 leading-relaxed">
              Determines primality via trial division up to the square root of N:
            </p>
            <div className="font-mono text-xs text-black/80 bg-[var(--color-paper)] p-2.5 border border-black/10">
              for i = 2 .. ⌊√N⌋:
              <br />
              &nbsp;&nbsp;if N % i == 0: composite
            </div>
            <p className="text-xs font-body text-black/60 leading-relaxed">
              If no factors exist ≤ √N, N cannot have any composite factor pairs, proving primality.
            </p>
          </div>

          {/* Palindrome Checking */}
          <div className="border border-black/15 p-5 bg-white space-y-2">
            <h3 className="font-heading font-bold text-base text-[var(--color-ink)]">
              Palindrome Checking
            </h3>
            <p className="text-xs font-body text-black/70 leading-relaxed">
              Verifies reflection symmetry across numeric and phrase inputs:
            </p>
            <div className="font-mono text-xs text-black/80 bg-[var(--color-paper)] p-2.5 border border-black/10">
              clean = filter(isalnum)
              <br />
              clean[i] == clean[n-1-i]
            </div>
            <p className="text-xs font-body text-black/60 leading-relaxed">
              Numeric mode reverses digits via modulo 10 arithmetic. Phrase mode normalizes characters to lowercase and strips non-alphanumeric symbols.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
