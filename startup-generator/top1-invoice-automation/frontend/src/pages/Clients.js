import React, { useState, useEffect } from 'react';
import { clientsAPI, companiesAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', vat_code: '', address: '', city: '',
    postal_code: '', email: '', phone: '', contact_person: '', notes: ''
  });

  useEffect(() => { loadCompanies(); }, []);
  useEffect(() => { if (selectedCompany) loadClients(); }, [selectedCompany]);

  const loadCompanies = async () => {
    try {
      const res = await companiesAPI.list();
      setCompanies(res.data);
      if (res.data.length > 0) setSelectedCompany(res.data[0].id);
    } catch (error) {
      toast.error('Klaida kraunant įmones');
    }
  };

  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await clientsAPI.list(selectedCompany);
      setClients(res.data);
    } catch (error) {
      toast.error('Klaida kraunant klientus');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.id, formData);
        toast.success('Klientas atnaujintas');
      } else {
        await clientsAPI.create({ ...formData, company_id: selectedCompany });
        toast.success('Klientas sukurtas');
      }
      setShowModal(false);
      setEditingClient(null);
      setFormData({ name: '', code: '', vat_code: '', address: '', city: '', postal_code: '', email: '', phone: '', contact_person: '', notes: '' });
      loadClients();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Klaida');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData(client);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Ar tikrai norite ištrinti šį klientą?')) {
      try {
        await clientsAPI.delete(id);
        toast.success('Klientas ištrintas');
        loadClients();
      } catch (error) {
        toast.error('Klaida trinant klientą');
      }
    }
  };

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl block mb-4">🏢</span>
        <h3 className="text-lg font-medium text-gray-900">Pirmiausia sukurkite įmonę</h3>
        <p className="text-gray-500 mt-2">Norėdami pridėti klientus, turite turėti bent vieną įmonę</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klientai</h1>
          <p className="text-gray-600">Valdykite savo klientų sąrašą</p>
        </div>
        <div className="flex space-x-3">
          <select value={selectedCompany} onChange={(e) => setSelectedCompany(parseInt(e.target.value))} className="px-3 py-2 border rounded-lg">
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => { setEditingClient(null); setFormData({ name: '', code: '', vat_code: '', address: '', city: '', postal_code: '', email: '', phone: '', contact_person: '', notes: '' }); setShowModal(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Naujas klientas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <span className="text-6xl block mb-4">👥</span>
          <h3 className="text-lg font-medium text-gray-900">Nėra klientų</h3>
          <p className="text-gray-500 mt-2">Pridėkite pirmąjį klientą</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Klientas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontaktai</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kodas</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Veiksmai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.address}, {client.city}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{client.email || '-'}</div>
                    <div className="text-sm text-gray-500">{client.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{client.code || '-'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(client)} className="text-blue-600 hover:text-blue-800">Redaguoti</button>
                    <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-800">Ištrinti</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingClient ? 'Redaguoti klientą' : 'Naujas klientas'}</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kontaktinis asmuo</label>
                  <input type="text" value={formData.contact_person} onChange={(e) => setFormData({...formData, contact_person: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresas</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miestas</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
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
