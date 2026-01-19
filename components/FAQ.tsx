'use client';

import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Ar tai advokatas?',
    answer:
      'Ne. Teisės draugas yra AI pagalbininkas, kuris padeda suformuluoti teisinius tekstus (pretenzijas, sutartis, laiškus). Tai nėra teisinis atstovavimas ir negali pakeisti advokato sudėtingose bylose. Tačiau daugeliui kasdienių situacijų – pavyzdžiui, rašant pretenziją pardavėjui – to visiškai pakanka.',
  },
  {
    question: 'Kiek tai kainuoja?',
    answer:
      'Šiuo metu Teisės draugas veikia pilotinio projekto režimu. Kaina priklauso nuo situacijos sudėtingumo – paklausk chate ir susitarsime. Paprastos pretenzijos ar šablonai dažnai būna nemokami.',
  },
  {
    question: 'Ar tinka Vinted, Facebook Marketplace ginčams?',
    answer:
      'Taip, puikiai tinka! Daugelis kreipimų būtent dėl tokių situacijų: pardavėjas atsiuntė ne tą prekę, prekė sugadinta, pinigai negrąžinami. Paruošiame oficialią pretenziją, kurią gali siųsti pardavėjui arba naudoti ginčo procedūroje.',
  },
  {
    question: 'Ar galiu įkelti dokumentą (sutartį, sąskaitą)?',
    answer:
      'Šiuo metu dokumentus gali aprašyti arba nukopijuoti tekstą į chatą. Artimiausiu metu planuojame įdiegti failų įkėlimą. Kol kas aprašyk svarbiausias dokumento dalis savo žodžiais.',
  },
  {
    question: 'Kaip greitai gausiu tekstą?',
    answer:
      'Daugumą tekstų paruošiame per kelias minutes. Sudėtingesnėms situacijoms gali prireikti kelių valandų, kad komanda peržiūrėtų ir patikslintų. Jei skubu – pasakyk chate.',
  },
  {
    question: 'Ką daryti, jei kita pusė neatsako į pretenziją?',
    answer:
      'Jei pardavėjas ar paslaugų teikėjas nereaguoja per nurodytą terminą (paprastai 14 dienų), turite kelias galimybes: kreiptis į Valstybinę vartotojų teisių apsaugos tarnybą (VVTAT), ginčų komisiją, arba teismą. Padėsime parinkti tinkamą kelią pagal jūsų situaciją.',
  },
  {
    question: 'Ar mano duomenys saugūs?',
    answer:
      'Taip. Nenaudojame jūsų duomenų treniruoti AI modelių. Pokalbiai saugomi tik tiek, kiek reikia jūsų užklausai įvykdyti. Nesiųsk asmens kodo, banko kortelių duomenų ar sveikatos informacijos. Daugiau – privatumo politikoje.',
  },
  {
    question: 'Ar galiu naudoti parašytą tekstą teisme?',
    answer:
      'Tekstą gali naudoti kaip pagrindą, bet teismui rekomenduojame pasikonsultuoti su advokatu. Pretenziją, skolos priminimą ar paprastą sutartį galima naudoti tiesiogiai – jie atitinka formalius reikalavimus.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-32 bg-navy-950">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Dažni klausimai
            </h2>
            <p className="text-navy-300 text-lg">
              Neradai atsakymo? Paklausk chate – atsakysime asmeniškai.
            </p>
          </div>

          {/* FAQ list */}
          <div className="glass-panel divide-y divide-navy-800">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  onClick={() => toggleFaq(index)}
                  className="faq-question px-6"
                  aria-expanded={openIndex === index}
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-navy-400 flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="faq-answer px-6">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-navy-400 mb-4">Turi kitą klausimą?</p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && '_chatlio' in window) {
                  const chatlio = (window as unknown as { _chatlio: { push: (args: string[]) => void } })._chatlio;
                  chatlio.push(['open']);
                }
              }}
              className="btn-secondary"
            >
              <MessageCircle className="w-4 h-4" />
              Klausk chate
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
