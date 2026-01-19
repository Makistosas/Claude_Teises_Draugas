'use client';

import { MessageSquare, Sparkles, FileCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Parašyk situaciją chate',
    description:
      'Aprašyk savo problemą ar situaciją – galima paprastai, savo žodžiais. Mes suprasime.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI suformuoja tekstą',
    description:
      'Mūsų AI pagalbininkas parengia pretenziją, sutartį ar oficialų laišką pagal tavo situaciją.',
  },
  {
    number: '03',
    icon: FileCheck,
    title: 'Patikslini ir panaudoji',
    description:
      'Peržiūrėk tekstą, paklausk patikslinimų ir naudok – siųsk, spausdink ar išsaugok.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-navy-950">
      <div className="section-container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Kaip tai veikia?
          </h2>
          <p className="text-navy-300 text-lg">
            Trys paprasti žingsniai nuo problemos iki sprendimo
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+60px)] right-[-60px] h-px bg-gradient-to-r from-navy-700 to-transparent">
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-600" />
                </div>
              )}

              {/* Step card */}
              <div className="glass-panel-sm p-6 h-full transition-transform hover:-translate-y-1">
                {/* Number badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-mono text-accent-blue">{step.number}</span>
                  <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-accent-blue" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-navy-300 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
