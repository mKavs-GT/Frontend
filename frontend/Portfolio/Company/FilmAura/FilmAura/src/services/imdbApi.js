// IMDb API Service with Mock Data Fallback
// Automatically uses mock data when API is unavailable or rate-limited

import { mockMoviesDatabase, mockSearchResults } from './mockData';

const COLLECTAPI_KEY = import.meta.env.VITE_COLLECTAPI_KEY;
const BASE_URL = 'https://api.collectapi.com/imdb';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Helper function to make API requests with caching and mock fallback
const fetchFromIMDb = async (endpoint, params = {}) => {
    // If mock data is enabled, use it directly
    if (USE_MOCK_DATA) {
        console.log('🎭 Using mock data (mock mode enabled)');
        return getMockData(endpoint, params);
    }

    // Create cache key
    const cacheKey = `${endpoint}-${JSON.stringify(params)}`;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Using cached data for:', cacheKey);
        return cached.data;
    }

    const url = new URL(`${BASE_URL}${endpoint}`);

    // Add query parameters
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });

    const options = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `apikey ${COLLECTAPI_KEY}`
        }
    };

    try {
        const response = await fetch(url, options);

        if (response.status === 429) {
            console.log('⚠️ Rate limit exceeded, falling back to mock data');
            return getMockData(endpoint, params);
        }

        if (!response.ok) {
            console.log(`⚠️ API error ${response.status}, falling back to mock data`);
            return getMockData(endpoint, params);
        }

        const data = await response.json();

        // Cache the successful response
        cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });

        console.log('✅ Using live API data');
        return data;
    } catch (error) {
        console.log('⚠️ API request failed, falling back to mock data:', error.message);
        // If we have cached data, return it even if expired
        if (cached) {
            console.log('📦 Using stale cache');
            return cached.data;
        }
        // Otherwise use mock data
        return getMockData(endpoint, params);
    }
};

// Get mock data based on endpoint and params
const getMockData = (endpoint, params) => {
    if (endpoint === '/imdbSearchById' && params.movieId) {
        const mockData = mockMoviesDatabase[params.movieId];
        if (mockData) {
            return mockData;
        }
        return {
            success: false,
            message: 'Movie not found in mock database'
        };
    }

    if (endpoint === '/imdbSearchByName' && params.query) {
        const query = params.query.toLowerCase();
        const mockData = mockSearchResults[query];
        if (mockData) {
            return mockData;
        }
        // Return empty results for unknown searches
        return {
            success: true,
            result: []
        };
    }

    return {
        success: false,
        message: 'Mock data not available for this endpoint'
    };
};

const imdbApi = {
    /**
     * Search for movies/series by name
     * @param {string} query - Search query (movie/series name)
     * @returns {Promise} Search results
     */
    searchByName: async (query) => {
        return fetchFromIMDb('/imdbSearchByName', { query });
    },

    /**
     * Search for movies/series by IMDb ID
     * @param {string} imdbId - IMDb ID (e.g., 'tt0111161')
     * @returns {Promise} Movie/series details
     */
    searchById: async (imdbId) => {
        return fetchFromIMDb('/imdbSearchById', { movieId: imdbId });
    },

    /**
     * Clear the cache
     */
    clearCache: () => {
        cache.clear();
        console.log('Cache cleared');
    }
};

/**
 * Format CollectAPI IMDb response to match our app structure
 * @param {Object} imdbData - Data from CollectAPI IMDb API
 * @returns {Object} Formatted movie object
 */
export const formatIMDbMovie = (imdbData) => {
    if (!imdbData || !imdbData.result) {
        return null;
    }

    const movie = imdbData.result;

    return {
        id: movie.imdbID,
        imdbId: movie.imdbID,
        title: movie.Title || 'Unknown',
        year: movie.Year || 'N/A',
        releaseDate: movie.Released || 'N/A',
        runtime: movie.Runtime || 'N/A',
        duration: movie.Runtime || 'N/A',
        genres: movie.Genre ? movie.Genre.split(', ').map(g => ({ name: g })) : [],
        director: movie.Director || 'N/A',
        writers: movie.Writer ? movie.Writer.split(', ') : [],
        actors: movie.Actors ? movie.Actors.split(', ') : [],
        description: movie.Plot || 'No description available.',
        tagline: '',
        languages: movie.Language || 'English',
        country: movie.Country || 'N/A',
        productionCountries: movie.Country || 'N/A',
        awards: movie.Awards || 'N/A',
        image: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster',
        backdrop: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null,
        imdbRating: movie.imdbRating && movie.imdbRating !== 'N/A' ? movie.imdbRating : 'N/A',
        imdbVotes: movie.imdbVotes || '0',
        voteCount: movie.imdbVotes ? movie.imdbVotes.replace(/,/g, '') : '0',
        metascore: movie.Metascore || 'N/A',
        ageRating: movie.Rated || 'Not Rated',
        type: movie.Type || 'movie',
        totalSeasons: movie.totalSeasons || null,
        boxOffice: movie.BoxOffice || 'N/A',
        production: movie.Production || 'N/A',
        website: movie.Website || null,
        ratings: movie.Ratings || [],
        seasons: movie.Seasons || []
    };
};

/**
 * Format search results from CollectAPI
 * @param {Object} searchData - Search results from CollectAPI
 * @returns {Array} Formatted search results
 */
export const formatIMDbSearchResults = (searchData) => {
    if (!searchData || !searchData.success || !searchData.result) {
        return [];
    }

    return searchData.result.map(movie => ({
        id: movie.imdbID,
        imdbId: movie.imdbID,
        title: movie.Title || 'Unknown',
        year: movie.Year || 'N/A',
        type: movie.Type || 'movie',
        image: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'
    }));
};

/**
 * Extract cast information from actors string
 * @param {string} actorsString - Comma-separated actors string
 * @returns {Array} Array of cast objects
 */
export const formatCastFromActors = (actorsString) => {
    if (!actorsString) return [];

    return actorsString.split(', ').map((actor, index) => ({
        id: `actor_${index}`,
        name: actor,
        character: 'Actor',
        profile_path: null
    }));
};

export default imdbApi;
