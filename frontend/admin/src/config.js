export const API_BASE_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname) 
  ? '' // Use Vite proxy in development
  : 'https://mkavs-backend.onrender.com';

export const WS_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? `ws://${window.location.hostname}:3000/staff`
  : 'wss://mkavs-backend.onrender.com/staff';
