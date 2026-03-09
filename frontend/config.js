const MKAVS_CONFIG = {
    // API_BASE_URL: 'http://localhost:3000' // Local development
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://dev.mkavs.com'
        : 'https://mkavs-backend.onrender.com'
};
