import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invoicesAPI, companiesAPI } from '../services/api';
import toast from 'react-hot-toast';

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-500'
};

const statusNames = {
  draft: 'Juodraštis',
  sent: 'Išsiųsta',
  paid: 'Apmokėta',
  overdue: 'Vėluoja',
  cancelled: 'Atšaukta'
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { loadCompanies(); }, []);
  useEffect(() => { if (selectedCompany) loadInvoices(); }, [selectedCompany, filter]);

  const loadCompanies = async () => {
    try {
      const res = await companiesAPI.list();
      setCompanies(res.data);
      if (res.data.length > 0) setSelectedCompany(res.data[0].id);
      else setLoading(false);
    } catch (error) {
      toast.error('Klaida');
      setLoading(false);
    }
  };

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const res = await invoicesAPI.list(selectedCompany, filter || undefined);
      setInvoices(res.data);
    } catch (error) {
      toast.error('Klaida kraunant sąskaitas');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (id, number) => {
    try {
      const res = await invoicesAPI.downloadPdf(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Klaida atsisiunčiant PDF');
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await invoicesAPI.markPaid(id);
      toast.success('Sąskaita pažymėta kaip apmokėta');
      loadInvoices();
    } catch (error) {
      toast.error('Klaida');
    }
  };

  const formatMoney = (cents) => (cents / 100).toFixed(2) + ' €';
  const formatDate = (date) => new Date(date).toLocaleDateString('lt-LT');

  if (companies.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl block mb-4">🏢</span>
        <h3 className="text-lg font-medium text-gray-900">Pirmiausia sukurkite įmonę</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sąskaitos faktūros</h1>
          <p className="text-gray-600">Visos jūsų išrašytos sąskaitos</p>
        </div>
        <div className="flex space-x-3">
          <select value={selectedCompany || ''} onChange={(e) => setSelectedCompany(parseInt(e.target.value))} className="px-3 py-2 border rounded-lg">
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
            <option value="">Visos</option>
            <option value="draft">Juodraščiai</option>
            <option value="sent">Išsiųstos</option>
            <option value="paid">Apmokėtos</option>
            <option value="overdue">Vėluojančios</option>
          </select>
          <Link to="/invoices/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Nauja sąskaita
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <span className="text-6xl block mb-4">🧾</span>
          <h3 className="text-lg font-medium text-gray-900">Nėra sąskaitų</h3>
          <p className="text-gray-500 mt-2">Sukurkite pirmąją sąskaitą per 30 sekundžių</p>
          <Link to="/invoices/new" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
            Sukurti sąskaitą
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nr.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Klientas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Suma</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statusas</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Veiksmai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-blue-600">{inv.invoice_number}</td>
                  <td className="px-6 py-4">{inv.client_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{formatDate(inv.issue_date)}</div>
                    {inv.due_date && <div className="text-xs">Iki: {formatDate(inv.due_date)}</div>}
                  </td>
                  <td className="px-6 py-4 font-medium">{formatMoney(inv.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[inv.status]}`}>
                      {statusNames[inv.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleDownloadPdf(inv.id, inv.invoice_number)} className="text-blue-600 hover:text-blue-800">PDF</button>
                    {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                      <button onClick={() => handleMarkPaid(inv.id)} className="text-green-600 hover:text-green-800">Apmokėta</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
