import axios from 'axios';

const rawURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (!import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL is not set. Defaulting to http://localhost:5000/api. Copy .env.example to .env to configure.');
}

// Normalize base URL: strip trailing slashes and ensure /api path is included
let baseURL = rawURL.trim().replace(/\/+$/, '');
if (!baseURL.endsWith('/api')) {
  baseURL = `${baseURL}/api`;
}

const client = axios.create({ baseURL, timeout: 20000 });

// Normalise every failure into { message, status, errors }
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isCancel(err)) return Promise.reject(err);
    const data = err.response?.data;
    return Promise.reject({
      status: err.response?.status ?? 0,
      message:
        data?.message ||
        (err.code === 'ECONNABORTED'
          ? 'The server took too long to respond. Try again.'
          : 'Cannot reach the server. Check your connection and try again.'),
      errors: data?.errors && typeof data.errors === 'object' ? data.errors : {},
    });
  }
);

export const listContacts = (params, signal) =>
  client.get('/contacts', { params, signal }).then((r) => r.data);
export const getContact = (id) => client.get(`/contacts/${id}`).then((r) => r.data.data);
export const createContact = (body) => client.post('/contacts', body).then((r) => r.data.data);
export const updateContact = (id, body) =>
  client.put(`/contacts/${id}`, body).then((r) => r.data.data);
export const deleteContact = (id) => client.delete(`/contacts/${id}`).then((r) => r.data);
