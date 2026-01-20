import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const storage = localStorage.getItem('auth-storage');
    if (storage) {
      const { state } = JSON.parse(storage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me')
};

export const companiesAPI = {
  list: () => api.get('/companies'),
  get: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`)
};

export const clientsAPI = {
  list: (companyId) => api.get(`/clients?company_id=${companyId}`),
  get: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`)
};

export const invoicesAPI = {
  list: (companyId, status) => {
    let url = `/invoices?company_id=${companyId}`;
    if (status) url += `&status=${status}`;
    return api.get(url);
  },
  get: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  downloadPdf: (id) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
  send: (id, data) => api.post(`/invoices/${id}/send`, data),
  markPaid: (id) => api.post(`/invoices/${id}/mark-paid`),
  stats: (companyId) => api.get(`/invoices/stats?company_id=${companyId}`)
};

export const subscriptionsAPI = {
  current: () => api.get('/subscriptions/current'),
  plans: () => api.get('/subscriptions/plans')
};

export const paymentsAPI = {
  checkout: (data) => api.post('/payments/checkout', data),
  history: () => api.get('/payments/history')
};

export default api;
