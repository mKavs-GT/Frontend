export const API_BASE_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname) 
  ? 'http://localhost:3000' 
  : 'https://mkavs-backend.onrender.com';

export const WS_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'ws://localhost:3000/staff'
  : 'wss://mkavs-backend.onrender.com/staff';
