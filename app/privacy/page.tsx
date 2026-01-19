import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privatumo politika – Teisės draugas',
  description: 'Teisės draugas privatumo politika. Kaip renkame, naudojame ir saugome jūsų duomenis.',
};

export default function PrivacyPage() {
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
            Privatumo politika
          </h1>
          <p className="text-navy-400 mb-8">
            Paskutinį kartą atnaujinta: 2025 m. sausio mėn.
          </p>

          <div className="prose prose-invert prose-navy max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Kas mes esame</h2>
              <p className="text-navy-300 leading-relaxed">
                Teisės draugas yra AI pagalbininkas, padedantis rengti teisinius dokumentus ir tekstus.
                Ši privatumo politika paaiškina, kaip renkame, naudojame ir saugome informaciją,
                kai naudojatės mūsų paslaugomis.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Kokią informaciją renkame</h2>
              <p className="text-navy-300 leading-relaxed mb-4">
                Renkame tik tą informaciją, kurią patys pateikiate chato pokalbyje:
              </p>
              <ul className="list-disc list-inside text-navy-300 space-y-2">
                <li>Jūsų pokalbio turinį (klausimai, situacijos aprašymai)</li>
                <li>Anoniminį sesijos identifikatorių (saugomas naršyklėje)</li>
                <li>Techninę informaciją (naršyklės tipas, įrenginio tipas)</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Ko nesiųsti</h2>
              <div className="glass-panel-sm p-4 border-amber-500/20 mb-4">
                <p className="text-amber-200 font-medium mb-2">⚠️ Prašome nesiųsti:</p>
                <ul className="list-disc list-inside text-navy-300 space-y-1">
                  <li>Asmens kodo</li>
                  <li>Banko kortelių numerių ar prisijungimo duomenų</li>
                  <li>Sveikatos informacijos</li>
                  <li>Slaptažodžių</li>
                </ul>
              </div>
              <p className="text-navy-300 leading-relaxed">
                Jei netyčia atsiuntėte tokią informaciją, parašykite mums ir ją pašalinsime.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Kaip naudojame informaciją</h2>
              <p className="text-navy-300 leading-relaxed mb-4">
                Jūsų pateiktą informaciją naudojame tik tam, kad:
              </p>
              <ul className="list-disc list-inside text-navy-300 space-y-2">
                <li>Parengtume jūsų prašomą teisinį tekstą</li>
                <li>Atsakytume į jūsų klausimus</li>
                <li>Tobulintume savo paslaugą (anoniminiu pavidalu)</li>
              </ul>
              <p className="text-navy-300 leading-relaxed mt-4">
                <strong className="text-white">Nenaudojame</strong> jūsų duomenų treniruoti AI modelių
                ir neparduodame jų trečiosioms šalims.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Kiek laiko saugome</h2>
              <p className="text-navy-300 leading-relaxed">
                Pokalbių duomenis saugome ribotą laiką – tiek, kiek reikia jūsų užklausai įvykdyti
                ir galimoms tęstinėms konsultacijoms. Po 30 dienų neaktyvumo pokalbiai automatiškai
                ištrinami.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Trečiosios šalys</h2>
              <p className="text-navy-300 leading-relaxed mb-4">
                Naudojame šias patikimas trečiąsias šalis:
              </p>
              <ul className="list-disc list-inside text-navy-300 space-y-2">
                <li><strong className="text-white">Chatlio</strong> – pokalbių platformai</li>
                <li><strong className="text-white">Slack</strong> – komandos komunikacijai</li>
                <li><strong className="text-white">Vercel</strong> – svetainės talpinimui</li>
              </ul>
              <p className="text-navy-300 leading-relaxed mt-4">
                Visos šios paslaugos atitinka BDAR reikalavimus.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Jūsų teisės</h2>
              <p className="text-navy-300 leading-relaxed mb-4">
                Pagal BDAR turite šias teises:
              </p>
              <ul className="list-disc list-inside text-navy-300 space-y-2">
                <li>Prašyti pateikti savo duomenis</li>
                <li>Prašyti ištaisyti netikslius duomenis</li>
                <li>Prašyti ištrinti duomenis</li>
                <li>Apriboti duomenų tvarkymą</li>
                <li>Pateikti skundą priežiūros institucijai</li>
              </ul>
              <p className="text-navy-300 leading-relaxed mt-4">
                Norėdami pasinaudoti šiomis teisėmis, susisiekite per chatą arba el. paštu.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Slapukai</h2>
              <p className="text-navy-300 leading-relaxed">
                Naudojame tik būtinus techninius slapukus svetainės veikimui užtikrinti.
                Nenaudojame sekimo slapukų ar trečiųjų šalių analitikos, kuri stebėtų jūsų
                veiklą kitose svetainėse.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Kontaktai</h2>
              <p className="text-navy-300 leading-relaxed">
                Jei turite klausimų dėl privatumo, kreipkitės per chatą arba el. paštu{' '}
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
