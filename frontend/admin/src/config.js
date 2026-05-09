export const API_BASE_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname) 
  ? '' // Use Vite proxy in development
  : 'https://mkavs-backend.onrender.com';

export const WS_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? `ws://${window.location.hostname}:3000/staff`
  : 'wss://mkavs-backend.onrender.com/staff';
export const authHeader = () => {
  const saved = localStorage.getItem('mkavs_admin_user');
  if (!saved) return {};
  try {
    const user = JSON.parse(saved);
    return { 'Authorization': `Bearer ${user.token}` };
  } catch (e) {
    return {};
  }
};
