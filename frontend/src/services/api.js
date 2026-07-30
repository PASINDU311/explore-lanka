import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// Request එකක් යද්දී Token එක sessionStorage හෝ localStorage දෙකෙන්ම අරගෙන Header එකට දානවා
API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;