'use client';

import {
  FileWarning,
  FileSignature,
  Scale,
  Receipt,
  ShoppingBag,
  Home,
  Car,
  Briefcase,
} from 'lucide-react';

const features = [
  {
    icon: FileWarning,
    title: 'Pretenzijos',
    description: 'Oficialūs reikalavimai pardavėjams, paslaugų teikėjams, rangovams.',
    examples: ['Grąžinti pinigus', 'Pakeisti prekę', 'Atlyginti žalą'],
  },
  {
    icon: FileSignature,
    title: 'Sutartys',
    description: 'Paprasti susitarimai be advokatų biuro.',
    examples: ['Nuomos', 'Paslaugų', 'Pirkimo-pardavimo'],
  },
  {
    icon: Receipt,
    title: 'Skolų priminimai',
    description: 'Mandagūs ir griežtesni priminimai skolininkams.',
    examples: ['Draugiškas priminimas', 'Oficialus reikalavimas', 'Paskutinis įspėjimas'],
  },
  {
    icon: Scale,
    title: 'Situacijos įvertinimas',
    description: 'Paaiškinimas, kaip atrodo jūsų situacija teisiniu požiūriu.',
    examples: ['Ar turiu teisę?', 'Ką daryti toliau?', 'Kokie terminai?'],
  },
];

const useCases = [
  { icon: ShoppingBag, label: 'Vinted ginčai' },
  { icon: Home, label: 'Nuomos problemos' },
  { icon: Car, label: 'Auto remontas' },
  { icon: Briefcase, label: 'Darbo teisė' },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-navy-900/50">
      <div className="section-container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ką gali padaryti?
          </h2>
          <p className="text-navy-300 text-lg">
            AI padeda sudėlioti tekstą – tu nuspręsi, kaip jį panaudoti
          </p>
        </div>

        {/* Main features grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-panel p-6 lg:p-8 transition-all hover:shadow-glow group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-blue/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-navy-300 mb-4">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.examples.map((example) => (
                      <span
                        key={example}
                        className="px-3 py-1 rounded-full bg-navy-800/50 text-xs text-navy-200"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Use cases */}
        <div className="glass-panel-sm p-6 lg:p-8">
          <p className="text-sm text-navy-400 mb-4 text-center">
            Populiarios situacijos:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800/50 border border-navy-700/50"
              >
                <useCase.icon className="w-4 h-4 text-accent-teal" />
                <span className="text-sm text-navy-200">{useCase.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
