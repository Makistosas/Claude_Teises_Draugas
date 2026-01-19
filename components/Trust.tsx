'use client';

import { Shield, EyeOff, AlertTriangle, Scale, Lock, CheckCircle } from 'lucide-react';

const trustPoints = [
  {
    icon: Shield,
    title: 'Pagal Lietuvos teisę',
    description:
      'Tekstai ruošiami vadovaujantis LR civiliniu kodeksu ir vartotojų teisių apsaugos reikalavimais.',
  },
  {
    icon: Lock,
    title: 'Konfidencialumas',
    description:
      'Jūsų duomenys lieka tarp mūsų. Nesaugome asmeninės informacijos ilgiau nei reikia.',
  },
  {
    icon: EyeOff,
    title: 'Be atsekimo',
    description:
      'Nenaudojame agresyvios analitikos. Jūsų privatumas mums svarbus.',
  },
];

const warnings = [
  'Nesiųsk asmens kodo',
  'Nesiųsk banko kortelių duomenų',
  'Nesiųsk sveikatos informacijos',
  'Nesiųsk slaptažodžių',
];

export default function Trust() {
  return (
    <section id="trust" className="py-20 lg:py-32 bg-navy-900/50">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Trust points */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Saugumas ir privatumas
            </h2>
            <p className="text-navy-300 text-lg mb-8">
              Suprantame, kad daliniesi jautria informacija. Štai ką darome, kad jaustumeis saugiai.
            </p>

            <div className="space-y-6">
              {trustPoints.map((point) => (
                <div key={point.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center flex-shrink-0">
                    <point.icon className="w-5 h-5 text-accent-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{point.title}</h3>
                    <p className="text-navy-300 text-sm leading-relaxed">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Warning card */}
          <div>
            <div className="glass-panel p-6 lg:p-8 border-amber-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Svarbu žinoti</h3>
                  <p className="text-sm text-navy-400">Ką nereikėtų siųsti chate</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {warnings.map((warning) => (
                  <div
                    key={warning}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-800/50"
                  >
                    <EyeOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-sm text-navy-200">{warning}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-navy-900/50 border border-navy-700/50">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-navy-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-navy-200 leading-relaxed">
                      <strong className="text-white">AI padeda suformuluoti tekstą</strong>, bet
                      tai nėra advokato atstovavimas. Sudėtingose situacijose rekomenduojame
                      konsultuotis su kvalifikuotu teisininku.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="trust-badge">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL šifravimas</span>
              </div>
              <div className="trust-badge">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>BDAR atitiktis</span>
              </div>
              <div className="trust-badge">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lietuva, EU</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
