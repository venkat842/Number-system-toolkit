import React, { useState } from 'react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between transition-colors">
        {/* Logo (left) */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <span className="font-heading text-[19px] sm:text-[22px] tracking-tight text-[var(--color-ink)] font-bold">
            Number System Toolkit
          </span>
          <span className="font-mono text-[19px] sm:text-[22px] text-[var(--color-signal)] select-none">
            0x
          </span>
        </div>

        {/* Desktop Nav Links (center, hidden below md) */}
        <nav className="hidden md:flex items-center gap-6 text-[17px] text-[var(--color-ink)] font-body">
          <button
            onClick={() => handleNavClick('convert')}
            className="hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-none p-0 text-left"
          >
            Convert
          </button>
          <button
            onClick={() => handleNavClick('primes')}
            className="hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-none p-0 text-left"
          >
            Primes
          </button>
          <button
            onClick={() => handleNavClick('palindromes')}
            className="hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-none p-0 text-left"
          >
            Palindromes
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-none p-0 text-left"
          >
            How it works
          </button>
        </nav>

        {/* Desktop CTA (right, hidden below md) */}
        <div className="hidden md:block">
          <button
            onClick={() => handleNavClick('convert')}
            className="text-[17px] font-body text-[var(--color-ink)] underline underline-offset-2 hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-none p-0"
          >
            Open the toolkit
          </button>
        </div>

        {/* Mobile Hamburger (visible below md) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative z-30 focus:outline-none"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span
            className={`w-6 h-[2px] bg-[var(--color-ink)] block transition-all duration-300 ${
              mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : 'mb-[5px]'
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-[var(--color-ink)] block transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100 mb-[5px]'
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-[var(--color-ink)] block transition-all duration-300 ${
              mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile Overlay (z-index: 15) */}
      <div
        className={`fixed inset-0 z-15 bg-[var(--color-paper)]/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-8 md:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => handleNavClick('convert')}
          className="text-[30px] font-medium text-[var(--color-ink)] font-body hover:opacity-60 transition-opacity text-left"
        >
          Convert
        </button>
        <button
          onClick={() => handleNavClick('primes')}
          className="text-[30px] font-medium text-[var(--color-ink)] font-body hover:opacity-60 transition-opacity text-left"
        >
          Primes
        </button>
        <button
          onClick={() => handleNavClick('palindromes')}
          className="text-[30px] font-medium text-[var(--color-ink)] font-body hover:opacity-60 transition-opacity text-left"
        >
          Palindromes
        </button>
        <button
          onClick={() => handleNavClick('how-it-works')}
          className="text-[30px] font-medium text-[var(--color-ink)] font-body hover:opacity-60 transition-opacity text-left"
        >
          How it works
        </button>
        <button
          onClick={() => handleNavClick('convert')}
          className="text-[30px] font-medium text-[var(--color-ink)] font-body underline underline-offset-4 hover:opacity-60 transition-opacity text-left pt-4"
        >
          Open the toolkit
        </button>
      </div>
    </>
  );
};
