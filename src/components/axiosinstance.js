// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://mytube.rodrigomaidana.com:8080/',
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes('/auth/')) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      //console.log('Token incluido en la solicitud:', token); // Debugging token inclusion
    } else {
      console.log('No se encontró token en localStorage'); // Debugging missing token
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
