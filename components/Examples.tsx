'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const examples = [
  {
    id: 1,
    type: 'Pretenzija',
    scenario: 'Pirkau batus Vinted, gavau ne tuos',
    preview: `PRETENZIJA
Dėl netinkamos prekės pristatymo

Gerbiamas pardavėjau,

2025 m. sausio 10 d. iš Jūsų įsigijau odinius batus (užsakymo Nr. 123456) už 85 EUR.

Gauta prekė neatitinka aprašymo: vietoj naujų 42 dydžio juodų batų gavau dėvėtus 44 dydžio rudus batus.

Vadovaujantis LR Civilinio kodekso 6.363 str., prašau per 7 kalendorines dienas:
□ Grąžinti sumokėtus pinigus (85 EUR)
□ arba pristatyti aprašymą atitinkančią prekę

Jei per nurodytą terminą problema nebus išspręsta, ...`,
  },
  {
    id: 2,
    type: 'Sutartis',
    scenario: 'Nuomoju butą draugui',
    preview: `BUTO NUOMOS SUTARTIS

1. ŠALYS
Nuomotojas: [Vardas Pavardė]
Nuomininkas: [Vardas Pavardė]

2. OBJEKTAS
Butas adresu: [Adresas]
Bendras plotas: [X] kv. m

3. NUOMOS MOKESTIS
Mėnesio nuoma: [X] EUR
Mokėjimo terminas: iki kiekvieno mėnesio [X] d.
Depozitas: [X] EUR (grąžinamas pasibaigus nuomai)

4. TERMINAS
Nuo: 2025-02-01
Iki: 2026-01-31

5. ŠALIŲ PAREIGOS
Nuomotojas įsipareigoja...
Nuomininkas įsipareigoja...`,
  },
  {
    id: 3,
    type: 'Skolos priminimas',
    scenario: 'Draugas skolingas 200€ jau 2 mėnesius',
    preview: `PRIMINIMAS DĖL SKOLOS

Sveiki, [Vardas],

Primenu, kad 2024 m. lapkričio mėn. paskolinau Jums 200 EUR su susitarimu grąžinti per mėnesį.

Šiuo metu skola negrąžinta jau 2 mėnesius.

Prašau skolą grąžinti iki 2025 m. vasario 1 d. į sąskaitą [IBAN] arba grynais.

Jei turite finansinių sunkumų, galime aptarti mokėjimo išdėstymą dalimis.

Nesulaukus atsako ar grąžinimo, būsiu priverstas(-a) imtis tolesnių veiksmų.

Pagarbiai,
[Vardas]`,
  },
];

export default function Examples() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = examples[currentIndex];

  const goTo = (index: number) => {
    setCurrentIndex((index + examples.length) % examples.length);
  };

  return (
    <section id="examples" className="py-20 lg:py-32 bg-navy-950">
      <div className="section-container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Pavyzdžiai
          </h2>
          <p className="text-navy-300 text-lg">
            Pažiūrėk, kokius dokumentus gali gauti
          </p>
        </div>

        {/* Example carousel */}
        <div className="max-w-3xl mx-auto">
          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mb-6">
            {examples.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-accent-blue w-6'
                    : 'bg-navy-600 hover:bg-navy-500'
                }`}
                aria-label={`Pavyzdys ${index + 1}`}
              />
            ))}
          </div>

          {/* Example card */}
          <div className="glass-panel overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <span className="text-xs text-accent-blue font-medium uppercase tracking-wider">
                  {current.type}
                </span>
                <h3 className="text-lg font-semibold text-white mt-1">
                  {current.scenario}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goTo(currentIndex - 1)}
                  className="p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700 transition-colors"
                  aria-label="Ankstesnis"
                >
                  <ChevronLeft className="w-5 h-5 text-navy-300" />
                </button>
                <button
                  onClick={() => goTo(currentIndex + 1)}
                  className="p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700 transition-colors"
                  aria-label="Kitas"
                >
                  <ChevronRight className="w-5 h-5 text-navy-300" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-navy-900/50">
              <pre className="text-sm text-navy-200 whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto scrollbar-hide">
                {current.preview}
              </pre>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-navy-900/30">
              <p className="text-xs text-navy-400 text-center">
                * Tai pavyzdinis tekstas. Tikras rezultatas pritaikomas tavo situacijai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
