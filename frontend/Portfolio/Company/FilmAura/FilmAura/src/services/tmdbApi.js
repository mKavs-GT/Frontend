// TMDB API Configuration
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

// Image sizes
export const IMAGE_SIZES = {
    poster: {
        small: 'w185',
        medium: 'w342',
        large: 'w500',
        original: 'original'
    },
    backdrop: {
        small: 'w300',
        medium: 'w780',
        large: 'w1280',
        original: 'original'
    }
};

// API Endpoints
const endpoints = {
    // Movies
    trendingMovies: '/trending/movie/week',
    popularMovies: '/movie/popular',
    topRatedMovies: '/movie/top_rated',
    nowPlayingMovies: '/movie/now_playing',
    upcomingMovies: '/movie/upcoming',
    movieDetails: (id) => `/movie/${id}`,
    movieCredits: (id) => `/movie/${id}/credits`,
    movieVideos: (id) => `/movie/${id}/videos`,
    similarMovies: (id) => `/movie/${id}/similar`,

    // TV Shows
    trendingTV: '/trending/tv/week',
    popularTV: '/tv/popular',
    topRatedTV: '/tv/top_rated',
    onTheAirTV: '/tv/on_the_air',
    tvDetails: (id) => `/tv/${id}`,
    tvCredits: (id) => `/tv/${id}/credits`,
    tvVideos: (id) => `/tv/${id}/videos`,
    similarTV: (id) => `/tv/${id}/similar`,

    // Search
    searchMulti: '/search/multi',
    searchMovie: '/search/movie',
    searchTV: '/search/tv',

    // Genres
    movieGenres: '/genre/movie/list',
    tvGenres: '/genre/tv/list'
};

// Helper function to build API URL
const buildUrl = (endpoint, params = {}) => {
    const url = new url("/Portfolio/Company/filmaura/`${BASE_URL}${endpoint}`");
    url.searchParams.append('api_key', API_KEY);

    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });

    return url.toString();
};

// Helper function to get image URL
export const getImageUrl = (path, size = 'original', type = 'poster') => {
    if (!path) return null;
    const sizeKey = IMAGE_SIZES[type][size] || IMAGE_SIZES[type].original;
    return `${IMAGE_BASE_URL}/${sizeKey}${path}`;
};

// API Service
const tmdbApi = {
    // Movies
    getTrendingMovies: async (page = 1) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.trendingMovies, { page }");
        const response = await fetch(url);
        return response.json();
    },

    getPopularMovies: async (page = 1) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.popularMovies, { page }");
        const response = await fetch(url);
        return response.json();
    },

    getTopRatedMovies: async (page = 1) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.topRatedMovies, { page }");
        const response = await fetch(url);
        return response.json();
    },

    getNowPlayingMovies: async (page = 1) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.nowPlayingMovies, { page }");
        const response = await fetch(url);
        return response.json();
    },

    getMovieDetails: async (id) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.movieDetails(id"), { append_to_response: 'credits,videos' });
        const response = await fetch(url);
        return response.json();
    },

    getSimilarMovies: async (id, page = 1) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.similarMovies(id"), { page });
        const response = await fetch(url);
        return response.json();
    },

    // TV Shows
    getTrendingTV: async (page = 1) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.trendingTV, { page }");
        const response = await fetch(url);
        return response.json();
    },

    getPopularTV: async (page = 1) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.popularTV, { page }");
        const response = await fetch(url);
        return response.json();
    },

    getTopRatedTV: async (page = 1) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.topRatedTV, { page }");
        const response = await fetch(url);
        return response.json();
    },

    getTVDetails: async (id) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.tvDetails(id"), { append_to_response: 'credits,videos' });
        const response = await fetch(url);
        return response.json();
    },

    // Search
    searchMulti: async (query, page = 1) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.searchMulti, { query, page }");
        const response = await fetch(url);
        return response.json();
    },

    searchMovies: async (query, page = 1) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.searchMovie, { query, page }");
        const response = await fetch(url);
        return response.json();
    },

    searchTV: async (query, page = 1) => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.searchTV, { query, page }");
        const response = await fetch(url);
        return response.json();
    },

    // Genres
    getMovieGenres: async () => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.movieGenres");
        const response = await fetch(url);
        return response.json();
    },

    getTVGenres: async () => {
        const url = buildurl("/Portfolio/Company/filmaura/endpoints.tvGenres");
        const response = await fetch(url);
        return response.json();
    }
};

export default tmdbApi;
