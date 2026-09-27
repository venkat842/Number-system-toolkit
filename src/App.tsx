import React, { useState } from 'react';
import { InteractiveBackground } from './components/InteractiveBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BaseConverter } from './components/BaseConverter';
import { PrimeChecker } from './components/PrimeChecker';
import { PalindromeChecker } from './components/PalindromeChecker';
import { HowItWorks } from './components/HowItWorks';
import { HistoryPanel } from './components/HistoryPanel';
import { Footer } from './components/Footer';
import { HistoryItem } from './types/index';

export const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedSample, setCopiedSample] = useState<string>('');

  const handleAddHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
    };
    setHistory((prev) => [newItem, ...prev].slice(0, 5));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSetSample = (val: string) => {
    setCopiedSample(val);
  };

  return (
    <div className="min-h-screen relative bg-[var(--color-paper)] text-[var(--color-ink)] font-body">
      {/* 1. Full-screen Interactive Mouse-Controlled Canvas Background */}
      <InteractiveBackground />

      {/* 2. Fixed Navbar */}
      <Navbar onNavigate={scrollToSection} />

      {/* 3. Hero Section (full screen) */}
      <HeroSection
        onNavigate={scrollToSection}
        onSetInitialSample={handleSetSample}
      />

      {/* 4. Main Tools Content Area */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-10 space-y-8 bg-[var(--color-paper)]/95 backdrop-blur-[2px]">
        {/* Base Conversion Section */}
        <BaseConverter
          onAddHistory={handleAddHistory}
          externalInput={copiedSample}
        />

        {/* Prime Checker Section */}
        <PrimeChecker onAddHistory={handleAddHistory} />

        {/* Palindrome Checker Section */}
        <PalindromeChecker onAddHistory={handleAddHistory} />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Persistent Session History */}
        <section className="pt-4 pb-8 max-w-4xl mx-auto">
          <HistoryPanel history={history} onClearHistory={handleClearHistory} />
        </section>
      </main>

      {/* 5. Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default App;
