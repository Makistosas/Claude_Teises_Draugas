import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invoicesAPI, companiesAPI, subscriptionsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [companiesRes, subscriptionRes] = await Promise.all([
        companiesAPI.list(),
        subscriptionsAPI.current()
      ]);

      setCompanies(companiesRes.data);
      setSubscription(subscriptionRes.data);

      // Load stats for first company
      if (companiesRes.data.length > 0) {
        const statsRes = await invoicesAPI.stats(companiesRes.data[0].id);
        setStats(statsRes.data);
      }
    } catch (error) {
      toast.error('Klaida kraunant duomenis');
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (cents) => {
    return (cents / 100).toFixed(2) + ' €';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Jūsų verslo apžvalga</p>
      </div>

      {/* Subscription Alert */}
      {subscription && subscription.plan === 'free' && (
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Atnaujinkite į Pro!</h3>
              <p className="mt-1 text-blue-100">
                Panaudojote {subscription.invoices_used}/{subscription.invoices_limit} nemokamų sąskaitų šį mėnesį
              </p>
            </div>
            <Link
              to="/settings"
              className="px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Atnaujinti
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Visos sąskaitos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_invoices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Apmokėtos</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid_invoices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Laukia apmokėjimo</p>
                <p className="text-2xl font-bold text-yellow-600">{formatMoney(stats.pending_amount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Bendros pajamos</p>
                <p className="text-2xl font-bold text-purple-600">{formatMoney(stats.total_revenue)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Greiti veiksmai</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/invoices/new"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-3xl mr-4">➕</span>
            <div>
              <p className="font-medium text-gray-900">Nauja sąskaita</p>
              <p className="text-sm text-gray-500">Sukurkite per 30 sek.</p>
            </div>
          </Link>

          <Link
            to="/clients"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="text-3xl mr-4">👥</span>
            <div>
              <p className="font-medium text-gray-900">Pridėti klientą</p>
              <p className="text-sm text-gray-500">Naujas klientas</p>
            </div>
          </Link>

          <Link
            to="/companies"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <span className="text-3xl mr-4">🏢</span>
            <div>
              <p className="font-medium text-gray-900">Įmonės nustatymai</p>
              <p className="text-sm text-gray-500">Rekvizitai ir logotipas</p>
            </div>
          </Link>
        </div>
      </div>

      {/* No companies warning */}
      {companies.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <span className="text-4xl mb-4 block">🏢</span>
          <h3 className="text-lg font-semibold text-yellow-800">Sukurkite savo įmonę</h3>
          <p className="text-yellow-600 mt-2">
            Norėdami išrašyti sąskaitas, pirmiausia turite sukurti įmonę su rekvizitais.
          </p>
          <Link
            to="/companies"
            className="inline-block mt-4 px-6 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Sukurti įmonę
          </Link>
        </div>
      )}
    </div>
  );
}
