import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { subscriptionsAPI, paymentsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, refreshUser } = useAuthStore();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [subRes, plansRes] = await Promise.all([
        subscriptionsAPI.current(),
        subscriptionsAPI.plans()
      ]);
      setSubscription(subRes.data);
      setPlans(plansRes.data);
    } catch (error) {
      toast.error('Klaida');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planCode) => {
    try {
      const res = await paymentsAPI.checkout({
        plan: planCode,
        period_months: 1
      });
      window.location.href = res.data.payment_url;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Klaida');
    }
  };

  const formatMoney = (cents) => (cents / 100).toFixed(2) + ' €';

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nustatymai</h1>
        <p className="text-gray-600">Valdykite savo paskyrą ir prenumeratą</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Profilis</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-500">Vardas</label>
            <p className="font-medium">{user?.full_name || '-'}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500">El. paštas</label>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Paskyra sukurta</label>
            <p className="font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString('lt-LT') : '-'}</p>
          </div>
        </div>
      </div>

      {/* Current Subscription */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Dabartinis planas</h2>
        {subscription && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600 capitalize">{subscription.plan}</p>
              <p className="text-gray-500 mt-1">
                Panaudota: {subscription.invoices_used} / {subscription.invoices_limit === 999999 ? '∞' : subscription.invoices_limit} sąskaitų šį mėnesį
              </p>
              {subscription.expires && (
                <p className="text-sm text-gray-500 mt-1">
                  Galioja iki: {new Date(subscription.expires).toLocaleDateString('lt-LT')}
                </p>
              )}
            </div>
            <div className="w-32 h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 bg-blue-600 rounded-full"
                style={{ width: `${Math.min(100, (subscription.invoices_used / subscription.invoices_limit) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Plans */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Planai</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.filter(p => p.code !== 'free').map((plan) => (
            <div
              key={plan.code}
              className={`border rounded-xl p-6 ${subscription?.plan === plan.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatMoney(plan.price_monthly)}
                <span className="text-sm font-normal text-gray-500">/mėn</span>
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {subscription?.plan === plan.code ? (
                <button disabled className="mt-6 w-full py-2 bg-gray-300 text-gray-600 rounded-lg">
                  Dabartinis planas
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.code)}
                  className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Atnaujinti
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
