import React, { useState, useEffect } from 'react';
import { companiesAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', vat_code: '', address: '', city: '',
    postal_code: '', email: '', phone: '', bank_name: '', bank_account: ''
  });

  useEffect(() => { loadCompanies(); }, []);

  const loadCompanies = async () => {
    try {
      const res = await companiesAPI.list();
      setCompanies(res.data);
    } catch (error) {
      toast.error('Klaida kraunant įmones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await companiesAPI.update(editingCompany.id, formData);
        toast.success('Įmonė atnaujinta');
      } else {
        await companiesAPI.create(formData);
        toast.success('Įmonė sukurta');
      }
      setShowModal(false);
      setEditingCompany(null);
      setFormData({ name: '', code: '', vat_code: '', address: '', city: '', postal_code: '', email: '', phone: '', bank_name: '', bank_account: '' });
      loadCompanies();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Klaida');
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData(company);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Ar tikrai norite ištrinti šią įmonę?')) {
      try {
        await companiesAPI.delete(id);
        toast.success('Įmonė ištrinta');
        loadCompanies();
      } catch (error) {
        toast.error('Klaida trinant įmonę');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Įmonės</h1>
          <p className="text-gray-600">Valdykite savo įmonių rekvizitus</p>
        </div>
        <button onClick={() => { setEditingCompany(null); setFormData({ name: '', code: '', vat_code: '', address: '', city: '', postal_code: '', email: '', phone: '', bank_name: '', bank_account: '' }); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Nauja įmonė
        </button>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <span className="text-6xl block mb-4">🏢</span>
          <h3 className="text-lg font-medium text-gray-900">Nėra įmonių</h3>
          <p className="text-gray-500 mt-2">Sukurkite pirmąją įmonę, kad galėtumėte išrašyti sąskaitas</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {companies.map((company) => (
            <div key={company.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                  <p className="text-gray-500">Kodas: {company.code || '-'} | PVM: {company.vat_code || '-'}</p>
                  <p className="text-gray-500 mt-1">{company.address}, {company.city} {company.postal_code}</p>
                  {company.bank_account && <p className="text-gray-500 mt-1">IBAN: {company.bank_account}</p>}
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(company)} className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded">Redaguoti</button>
                  <button onClick={() => handleDelete(company.id)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded">Ištrinti</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingCompany ? 'Redaguoti įmonę' : 'Nauja įmonė'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pavadinimas *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Įmonės kodas</label>
                  <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PVM kodas</label>
                  <input type="text" value={formData.vat_code} onChange={(e) => setFormData({...formData, vat_code: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">El. paštas</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefonas</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresas</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miestas</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pašto kodas</label>
                  <input type="text" value={formData.postal_code} onChange={(e) => setFormData({...formData, postal_code: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bankas</label>
                  <input type="text" value={formData.bank_name} onChange={(e) => setFormData({...formData, bank_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                  <input type="text" value={formData.bank_account} onChange={(e) => setFormData({...formData, bank_account: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Atšaukti</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Išsaugoti</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
