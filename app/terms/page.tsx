import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Naudojimo sąlygos – Teisės draugas',
  description: 'Teisės draugas paslaugos naudojimo sąlygos ir taisyklės.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-navy-950">
      {/* Header */}
      <header className="border-b border-navy-800">
        <div className="section-container py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center">
                <Scale className="w-4 h-4 text-accent-blue" />
              </div>
              <span className="font-semibold text-white">Teisės draugas</span>
            </Link>
            <Link href="/" className="btn-ghost text-sm">
              <ArrowLeft className="w-4 h-4" />
              Grįžti
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="section-container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Naudojimo sąlygos
          </h1>
          <p className="text-navy-400 mb-8">
            Paskutinį kartą atnaujinta: 2025 m. sausio mėn.
          </p>

          <div className="prose prose-invert prose-navy max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Paslaugos aprašymas</h2>
              <p className="text-navy-300 leading-relaxed">
                Teisės draugas yra AI pagalbininkas, teikiantis pagalbą rengiant teisinius tekstus:
                pretenzijas, sutartis, skolų priminimus ir kitus dokumentus. Paslauga skirta padėti
                formuluoti tekstus, bet <strong className="text-white">neatstovauja teisinei konsultacijai</strong>.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Kas tai NĖRA</h2>
              <div className="glass-panel-sm p-4 border-amber-500/20">
                <p className="text-navy-300 leading-relaxed">
                  <strong className="text-white">Svarbu suprasti:</strong>
                </p>
                <ul className="list-disc list-inside text-navy-300 space-y-2 mt-2">
                  <li>Teisės draugas <strong className="text-white">nėra advokatas</strong> ir neteikia teisinio atstovavimo</li>
                  <li>Paruošti tekstai yra <strong className="text-white">šablonai ir pasiūlymai</strong>, ne galutiniai teisiniai dokumentai</li>
                  <li>Sudėtingoms situacijoms <strong className="text-white">rekomenduojame konsultuotis</strong> su kvalifikuotu teisininku</li>
                  <li>Negarantuojame konkretaus teisinio rezultato</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Naudotojo atsakomybė</h2>
              <p className="text-navy-300 leading-relaxed mb-4">
                Naudodamiesi Teisės draugo paslaugomis, jūs:
              </p>
              <ul className="list-disc list-inside text-navy-300 space-y-2">
                <li>Pateikiate tikslią ir teisingą informaciją apie savo situaciją</li>
                <li>Suprantate, kad AI gali klysti ir reikia kritiškai vertinti rezultatą</li>
                <li>Prisiimate atsakomybę už paruoštų tekstų naudojimą</li>
                <li>Nesiųsite draudžiamos informacijos (asmens kodų, banko duomenų ir pan.)</li>
                <li>Nenaudosite paslaugos neteisėtiems tikslams</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Paslaugos apribojimai</h2>
              <p className="text-navy-300 leading-relaxed mb-4">
                Teisės draugas:
              </p>
              <ul className="list-disc list-inside text-navy-300 space-y-2">
                <li>Negarantuoja 100% tekstų tikslumo – visada peržiūrėkite prieš naudodami</li>
                <li>Negali atstovauti teisme ar kitose institucijose</li>
                <li>Negali suteikti oficialios teisinės konsultacijos</li>
                <li>Gali būti laikinai nepasiekiamas dėl techninių priežasčių</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Intelektinė nuosavybė</h2>
              <p className="text-navy-300 leading-relaxed">
                Paruošti tekstai, sukurti pagal jūsų pateiktą informaciją, priklauso jums ir galite
                juos laisvai naudoti, keisti bei platinti. Svetainės dizainas, logotipas ir kitas
                turinys priklauso Teisės draugui.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Mokėjimas</h2>
              <p className="text-navy-300 leading-relaxed">
                Šiuo metu Teisės draugas veikia pilotinio projekto režimu. Kai kurios paslaugos
                gali būti mokamos – apie tai informuojame prieš pradedant darbą. Kainos derinamos
                individualiai per pokalbį.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Atsakomybės ribojimas</h2>
              <p className="text-navy-300 leading-relaxed">
                Teisės draugas neatsako už:
              </p>
              <ul className="list-disc list-inside text-navy-300 space-y-2 mt-2">
                <li>Žalą, kilusią dėl netinkamo paruoštų tekstų panaudojimo</li>
                <li>Teisinių bylų rezultatus</li>
                <li>Klaidingą informaciją, pateiktą naudotojo</li>
                <li>Paslaugos veikimo sutrikimus</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Sąlygų keitimas</h2>
              <p className="text-navy-300 leading-relaxed">
                Pasiliekame teisę keisti šias sąlygas. Apie esminius pakeitimus informuosime
                svetainėje. Tolimesnis naudojimasis paslauga po pakeitimų reiškia sutikimą su
                naujomis sąlygomis.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Taikoma teisė</h2>
              <p className="text-navy-300 leading-relaxed">
                Šioms sąlygoms taikoma Lietuvos Respublikos teisė. Ginčai sprendžiami Lietuvos
                Respublikos teismuose.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Kontaktai</h2>
              <p className="text-navy-300 leading-relaxed">
                Klausimai dėl naudojimo sąlygų? Kreipkitės per chatą arba el. paštu{' '}
                <a href="mailto:info@teisesdraugas.lt" className="text-accent-blue hover:underline">
                  info@teisesdraugas.lt
                </a>
              </p>
            </section>
          </div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-navy-800">
            <Link href="/" className="btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              Grįžti į pagrindinį puslapį
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
