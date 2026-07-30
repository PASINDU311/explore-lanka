import axios from 'axios';

// Backend URL එක Base URL එක ලෙස set කිරීම
const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// සෑම Request එකකටම JWT Token එක Auto-Attach කිරීමේ Logic එක
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;