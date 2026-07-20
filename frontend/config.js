const MKAVS_CONFIG = {
    API_BASE_URL:
        window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1'
            ? 'https://api-mkavs.vercel.app'
            : 'https://api.mkavs.com'
};
