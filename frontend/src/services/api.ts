import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // Vite proxy -> http://localhost:3333
  timeout: 8000,
});