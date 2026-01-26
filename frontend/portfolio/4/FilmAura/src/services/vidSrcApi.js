// VidSrc Embed API Service
const VIDSRC_BASE_URL = 'https://vidsrc-embed.ru/embed';

/**
 * Generate embed URL for movies
 * @param {string|number} id - IMDB ID (tt1234567) or TMDB ID (123456)
 * @param {Object} options - Optional parameters
 * @param {string} options.sub_url - URL encoded subtitle file (.srt or .vtt)
 * @param {string} options.ds_lang - Default subtitle language (ISO639 code)
 * @param {number} options.autoplay - 1 or 0 (default: 1)
 * @returns {string} Embed URL
 */
export const getMovieEmbedUrl = (id, options = {}) => {
    const isImdb = typeof id === 'string' && id.startsWith('tt');
    const isTmdb = typeof id === 'number' || !isNaN(id);

    // Build base URL
    let url = `${VIDSRC_BASE_URL}/movie`;
    const params = new URLSearchParams();

    // Add ID to params
    if (isImdb) {
        params.append('imdb', id);
    } else if (isTmdb) {
        params.append('tmdb', id);
    } else {
        throw new Error('Invalid ID format. Must be IMDB (tt1234567) or TMDB (123456)');
    }

    // Add optional parameters
    if (options.sub_url) params.append('sub_url', options.sub_url);
    if (options.ds_lang) params.append('ds_lang', options.ds_lang);
    if (options.autoplay !== undefined) params.append('autoplay', options.autoplay);

    return `${url}?${params.toString()}`;
};

/**
 * Generate embed URL for TV shows
 * @param {string|number} id - IMDB ID (tt1234567) or TMDB ID (123456)
 * @param {number} season - Season number
 * @param {number} episode - Episode number
 * @param {Object} options - Optional parameters
 * @returns {string} Embed URL
 */
export const getTVEmbedUrl = (id, season, episode, options = {}) => {
    const isImdb = typeof id === 'string' && id.startsWith('tt');
    const isTmdb = typeof id === 'number' || !isNaN(id);

    // Build base URL
    let url = `${VIDSRC_BASE_URL}/tv`;
    const params = new URLSearchParams();

    // Add ID to params
    if (isImdb) {
        params.append('imdb', id);
    } else if (isTmdb) {
        params.append('tmdb', id);
    }

    // Add season and episode
    if (season) params.append('season', season);
    if (episode) params.append('episode', episode);

    // Add optional parameters
    if (options.sub_url) params.append('sub_url', options.sub_url);
    if (options.ds_lang) params.append('ds_lang', options.ds_lang);
    if (options.autoplay !== undefined) params.append('autoplay', options.autoplay);

    return `${url}?${params.toString()}`;
};

/**
 * Get IMDB ID from TMDB API
 * @param {number} tmdbId - TMDB movie/TV ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise<string>} IMDB ID
 */
export const getImdbIdFromTmdb = async (tmdbId, type = 'movie') => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/${type}/${tmdbId}/external_ids?api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.imdb_id;
    } catch (error) {
        console.error('Error fetching IMDB ID:', error);
        return null;
    }
};

export default {
    getMovieEmbedUrl,
    getTVEmbedUrl,
    getImdbIdFromTmdb
};
