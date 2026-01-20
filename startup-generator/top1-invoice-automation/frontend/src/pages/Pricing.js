import React from 'react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Nemokamas',
    price: 0,
    features: [
      '5 sąskaitos per mėnesį',
      'PDF generavimas',
      'Viena įmonė',
      'El. pašto siuntimas'
    ],
    cta: 'Pradėti nemokamai',
    popular: false
  },
  {
    name: 'Starter',
    price: 19,
    features: [
      '50 sąskaitų per mėnesį',
      'Neribota įmonių',
      'Mokėjimo priminimai',
      'Bazinės ataskaitos',
      'El. pašto palaikymas'
    ],
    cta: 'Išbandyti',
    popular: false
  },
  {
    name: 'Pro',
    price: 39,
    features: [
      'Neribota sąskaitų',
      'Neribota įmonių',
      'Automatiniai priminimai',
      'Pilnos ataskaitos',
      'API prieiga',
      'Prioritetinis palaikymas'
    ],
    cta: 'Pasirinkti Pro',
    popular: true
  },
  {
    name: 'Business',
    price: 79,
    features: [
      'Viskas iš Pro',
      'Multi-user (iki 5)',
      'Rolės ir teisės',
      'Banko integracija',
      'Custom branding',
      'Dedikuotas palaikymas'
    ],
    cta: 'Susisiekti',
    popular: false
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link to="/" className="text-4xl font-bold text-white">🧾 Saskaita.lt</Link>
          <h1 className="text-4xl font-bold text-white mt-8">Paprastos kainos, didelė nauda</h1>
          <p className="text-blue-100 mt-4 text-lg">Išsirinkite planą, kuris tinka jūsų verslui</p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-6 ${plan.popular ? 'ring-4 ring-yellow-400 transform scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  POPULIARIAUSIAS
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-600">€{plan.price}</span>
                {plan.price > 0 && <span className="text-gray-500">/mėn</span>}
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`mt-8 block w-full py-3 text-center rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Dažnai užduodami klausimai</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-white">Ar galiu atšaukti bet kada?</h3>
              <p className="text-blue-100 mt-2">Taip, galite atšaukti prenumeratą bet kuriuo metu. Prieiga išliks iki apmokėto periodo pabaigos.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-white">Kokius mokėjimo būdus priimate?</h3>
              <p className="text-blue-100 mt-2">Priimame mokėjimus per Paysera - banko pavedimus, korteles ir kitus būdus.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-white">Ar sąskaitos atitinka LT teisės aktus?</h3>
              <p className="text-blue-100 mt-2">Taip, visos sąskaitos atitinka Lietuvos buhalterinės apskaitos ir VMI reikalavimus.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-white">Ar galiu importuoti esamus klientus?</h3>
              <p className="text-blue-100 mt-2">Pro ir Business planuose galite importuoti klientus iš CSV failo.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-blue-50 transition-colors"
          >
            Pradėti nemokamai →
          </Link>
          <p className="text-blue-200 mt-4">Nereikia kortelės. 5 sąskaitos per mėnesį - nemokamai amžinai.</p>
        </div>
      </div>
    </div>
  );
}
