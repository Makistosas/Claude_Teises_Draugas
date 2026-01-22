'use client';

import Link from 'next/link';
import { Scale, Mail } from 'lucide-react';

const footerLinks = {
  main: [
    { label: 'Kaip veikia', href: '#how-it-works' },
    { label: 'Ką gali padaryti', href: '#features' },
    { label: 'Pavyzdžiai', href: '#examples' },
    { label: 'DUK', href: '#faq' },
  ],
  legal: [
    { label: 'Privatumo politika', href: '/privacy' },
    { label: 'Naudojimo sąlygos', href: '/terms' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 border-t border-navy-800">
      <div className="section-container py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-accent-blue" />
              </div>
              <span className="text-xl font-semibold text-white">Teisės draugas</span>
            </div>
            <p className="text-navy-400 text-sm max-w-sm mb-6">
              AI pagalbininkas, kai reikia parašyti pretenziją, sutartį ar aiškų laišką.
              Padedame sudėlioti tekstą – tu nuspręsi, kaip jį panaudoti.
            </p>
            <div className="flex gap-3">
              <a
                href="mailto:info@teisesdraugas.lt"
                className="btn-ghost text-sm"
              >
                <Mail className="w-4 h-4" />
                El. paštas
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">Navigacija</h4>
            <ul className="space-y-2">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-navy-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Teisinė informacija</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-navy-500">
            © {currentYear} Teisės draugas. Visos teisės saugomos.
          </p>
          <p className="text-xs text-navy-600">
            AI pagalbininkas, ne advokatas. Sudėtingoms situacijoms rekomenduojame kvalifikuotą teisinę konsultaciją.
          </p>
        </div>
      </div>
    </footer>
  );
}
