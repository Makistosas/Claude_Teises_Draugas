import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoicesAPI, companiesAPI, clientsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({
    client_id: '',
    vat_rate: 21,
    notes: '',
    payment_terms: 'Mokėti per 14 dienų',
    items: [{ description: '', quantity: 1, unit: 'vnt.', unit_price: 0 }]
  });

  useEffect(() => { loadCompanies(); }, []);
  useEffect(() => { if (selectedCompany) loadClients(); }, [selectedCompany]);

  const loadCompanies = async () => {
    try {
      const res = await companiesAPI.list();
      setCompanies(res.data);
      if (res.data.length > 0) setSelectedCompany(res.data[0].id);
    } catch (error) {
      toast.error('Klaida');
    }
  };

  const loadClients = async () => {
    try {
      const res = await clientsAPI.list(selectedCompany);
      setClients(res.data);
    } catch (error) {
      toast.error('Klaida');
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unit: 'vnt.', unit_price: 0 }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const items = [...formData.items];
      items.splice(index, 1);
      setFormData({ ...formData, items });
    }
  };

  const updateItem = (index, field, value) => {
    const items = [...formData.items];
    items[index][field] = field === 'unit_price' || field === 'quantity' ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, items });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price * 100), 0);
  };

  const calculateVat = () => {
    return Math.round(calculateSubtotal() * formData.vat_rate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVat();
  };

  const formatMoney = (cents) => (cents / 100).toFixed(2) + ' €';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client_id) {
      toast.error('Pasirinkite klientą');
      return;
    }

    if (formData.items.some(item => !item.description || item.unit_price <= 0)) {
      toast.error('Užpildykite visas eilutes');
      return;
    }

    setLoading(true);
    try {
      const data = {
        company_id: selectedCompany,
        client_id: parseInt(formData.client_id),
        vat_rate: parseFloat(formData.vat_rate),
        notes: formData.notes,
        payment_terms: formData.payment_terms,
        items: formData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: Math.round(item.unit_price * 100)  // Convert to cents
        }))
      };

      await invoicesAPI.create(data);
      toast.success('Sąskaita sukurta!');
      navigate('/invoices');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Klaida kuriant sąskaitą');
    } finally {
      setLoading(false);
    }
  };

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl block mb-4">🏢</span>
        <h3 className="text-lg font-medium text-gray-900">Pirmiausia sukurkite įmonę</h3>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nauja sąskaita faktūra</h1>
        <p className="text-gray-600">Sukurkite sąskaitą per 30 sekundžių</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company & Client Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Pagrindinė informacija</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jūsų įmonė</label>
              <select
                value={selectedCompany || ''}
                onChange={(e) => setSelectedCompany(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Klientas *</label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">-- Pasirinkite --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Prekės / Paslaugos</h2>
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Aprašymas</label>}
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Prekė arba paslauga"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Kiekis</label>}
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-1">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Vnt.</label>}
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Kaina (€)</label>}
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unit_price}
                    onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-1">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Suma</label>}
                  <div className="px-3 py-2 text-sm font-medium">{formatMoney(item.quantity * item.unit_price * 100)}</div>
                </div>
                <div className="col-span-1">
                  {formData.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="mt-4 text-blue-600 hover:text-blue-800">
            + Pridėti eilutę
          </button>
        </div>

        {/* Totals */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">PVM tarifas (%)</label>
              <select
                value={formData.vat_rate}
                onChange={(e) => setFormData({ ...formData, vat_rate: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="21">21%</option>
                <option value="9">9%</option>
                <option value="5">5%</option>
                <option value="0">0%</option>
              </select>
            </div>
            <div className="text-right space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Be PVM:</span><span className="font-medium ml-8">{formatMoney(calculateSubtotal())}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">PVM ({formData.vat_rate}%):</span><span className="font-medium ml-8">{formatMoney(calculateVat())}</span></div>
              <div className="flex justify-between text-xl"><span className="font-semibold">Viso:</span><span className="font-bold text-blue-600 ml-8">{formatMoney(calculateTotal())}</span></div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mokėjimo sąlygos</label>
              <input
                type="text"
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pastabos</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Papildomos pastabos..."
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => navigate('/invoices')} className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            Atšaukti
          </button>
          <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Kuriama...' : 'Sukurti sąskaitą'}
          </button>
        </div>
      </form>
    </div>
  );
}
