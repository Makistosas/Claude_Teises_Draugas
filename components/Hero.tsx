'use client';

import { Shield, Lock, Scale, Banknote, ArrowDown } from 'lucide-react';
import ChatlioEmbed from './ChatlioEmbed';
import IntakeChips from './IntakeChips';

const trustBadges = [
  { icon: Scale, label: 'Be teismo' },
  { icon: Lock, label: 'Konfidencialu' },
  { icon: Shield, label: 'Pagal LR civilinį kodeksą' },
  { icon: Banknote, label: 'Iki ~5000€' },
];

export default function Hero() {
  const scrollToHow = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-accent-teal/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-16 lg:py-20">
          {/* Left side - Copy */}
          <div className="space-y-6 lg:space-y-8 animate-fade-in">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-accent-blue" />
              </div>
              <span className="text-xl font-semibold text-white">Teisės draugas</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Kai teisininkas per brangus,{' '}
                <span className="text-accent-blue">o tylėti per skaudu.</span>
              </h1>
              <p className="text-lg text-navy-200 leading-relaxed max-w-xl">
                Per kelias minutes paruošk pretenziją, sutartį ar aiškų laišką.
                Rašai čia – žinutės keliauja į mūsų Slack, kad galėtume padėti
                sudėlioti tekstą.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="trust-badge">
                  <badge.icon className="w-3.5 h-3.5 text-accent-teal" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && '_chatlio' in window) {
                    const chatlio = (window as unknown as { _chatlio: { push: (args: string[]) => void } })._chatlio;
                    chatlio.push(['open']);
                  }
                }}
                className="btn-primary relative"
              >
                <span className="pulse-ring" />
                Pradėti pokalbį
              </button>
              <button onClick={scrollToHow} className="btn-secondary">
                <ArrowDown className="w-4 h-4" />
                Kaip tai veikia
              </button>
            </div>

            {/* Mobile: Show chat trigger */}
            <div className="lg:hidden mt-4">
              <ChatlioEmbed />
            </div>
          </div>

          {/* Right side - Chat panel */}
          <div className="hidden lg:block animate-slide-up">
            <div className="glass-panel p-6 space-y-6 shadow-glow">
              {/* Chat panel header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse-soft" />
                <span className="text-sm text-navy-200">Prisijungta – rašyk savo klausimą</span>
              </div>

              {/* Intake chips */}
              <IntakeChips />

              {/* Chat embed area */}
              <div className="pt-4 border-t border-white/10">
                <ChatlioEmbed />
              </div>

              {/* Helper text */}
              <p className="text-xs text-navy-500 text-center">
                Visos žinutės siunčiamos į mūsų komandą per Chatlio
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
          <button
            onClick={scrollToHow}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Slinkti žemyn"
          >
            <ArrowDown className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
