// OMDb API Service (Uses IMDb data)
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com';

/**
 * OMDb API Service
 * Free API that provides IMDb data
 * Get your API key from: http://www.omdbapi.com/apikey.aspx
 */

const omdbApi = {
    /**
     * Search for movies/series by title
     * @param {string} query - Search query
     * @param {number} page - Page number (default: 1)
     * @param {string} type - Type filter: 'movie', 'series', or '' for all
     * @returns {Promise} Search results
     */
    search: async (query, page = 1, type = '') => {
        const url = new URL(OMDB_BASE_URL);
        url.searchParams.append('apikey', OMDB_API_KEY);
        url.searchParams.append('s', query);
        url.searchParams.append('page', page);
        if (type) url.searchParams.append('type', type);

        const response = await fetch(url);
        return response.json();
    },

    /**
     * Get movie/series details by IMDb ID
     * @param {string} imdbId - IMDb ID (e.g., 'tt0111161')
     * @param {boolean} fullPlot - Get full plot instead of short (default: true)
     * @returns {Promise} Movie details
     */
    getByImdbId: async (imdbId, fullPlot = true) => {
        const url = new URL(OMDB_BASE_URL);
        url.searchParams.append('apikey', OMDB_API_KEY);
        url.searchParams.append('i', imdbId);
        url.searchParams.append('plot', fullPlot ? 'full' : 'short');

        const response = await fetch(url);
        return response.json();
    },

    /**
     * Get movie/series details by title
     * @param {string} title - Movie/series title
     * @param {string} year - Release year (optional)
     * @param {string} type - Type: 'movie', 'series', or 'episode'
     * @returns {Promise} Movie details
     */
    getByTitle: async (title, year = '', type = '') => {
        const url = new URL(OMDB_BASE_URL);
        url.searchParams.append('apikey', OMDB_API_KEY);
        url.searchParams.append('t', title);
        if (year) url.searchParams.append('y', year);
        if (type) url.searchParams.append('type', type);
        url.searchParams.append('plot', 'full');

        const response = await fetch(url);
        return response.json();
    },

    /**
     * Get season details for a TV series
     * @param {string} imdbId - IMDb ID of the series
     * @param {number} season - Season number
     * @returns {Promise} Season details
     */
    getSeason: async (imdbId, season) => {
        const url = new URL(OMDB_BASE_URL);
        url.searchParams.append('apikey', OMDB_API_KEY);
        url.searchParams.append('i', imdbId);
        url.searchParams.append('Season', season);

        const response = await fetch(url);
        return response.json();
    }
};

/**
 * Format OMDb response to match our app's movie object structure
 * @param {Object} omdbMovie - Movie data from OMDb API
 * @returns {Object} Formatted movie object
 */
export const formatOMDbMovie = (omdbMovie) => {
    if (!omdbMovie || omdbMovie.Response === 'False') {
        return null;
    }

    return {
        id: omdbMovie.imdbID,
        imdbId: omdbMovie.imdbID,
        title: omdbMovie.Title,
        year: omdbMovie.Year,
        releaseDate: omdbMovie.Released !== 'N/A' ? omdbMovie.Released : 'N/A',
        runtime: omdbMovie.Runtime !== 'N/A' ? omdbMovie.Runtime : 'N/A',
        duration: omdbMovie.Runtime !== 'N/A' ? omdbMovie.Runtime : 'N/A',
        genres: omdbMovie.Genre !== 'N/A' ? omdbMovie.Genre.split(', ').map(g => ({ name: g })) : [],
        director: omdbMovie.Director !== 'N/A' ? omdbMovie.Director : 'N/A',
        writers: omdbMovie.Writer !== 'N/A' ? omdbMovie.Writer.split(', ') : [],
        actors: omdbMovie.Actors !== 'N/A' ? omdbMovie.Actors.split(', ') : [],
        description: omdbMovie.Plot !== 'N/A' ? omdbMovie.Plot : 'No description available.',
        tagline: '',
        languages: omdbMovie.Language !== 'N/A' ? omdbMovie.Language : 'English',
        country: omdbMovie.Country !== 'N/A' ? omdbMovie.Country : 'N/A',
        productionCountries: omdbMovie.Country !== 'N/A' ? omdbMovie.Country : 'N/A',
        awards: omdbMovie.Awards !== 'N/A' ? omdbMovie.Awards : 'N/A',
        image: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster',
        backdrop: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
        imdbRating: omdbMovie.imdbRating !== 'N/A' ? `IMDb ${omdbMovie.imdbRating}` : 'N/A',
        imdbVotes: omdbMovie.imdbVotes !== 'N/A' ? omdbMovie.imdbVotes : '0',
        voteCount: omdbMovie.imdbVotes !== 'N/A' ? omdbMovie.imdbVotes.replace(/,/g, '') : '0',
        metascore: omdbMovie.Metascore !== 'N/A' ? omdbMovie.Metascore : 'N/A',
        ageRating: omdbMovie.Rated !== 'N/A' ? omdbMovie.Rated : 'Not Rated',
        type: omdbMovie.Type, // 'movie' or 'series'
        totalSeasons: omdbMovie.totalSeasons || null,
        boxOffice: omdbMovie.BoxOffice !== 'N/A' ? omdbMovie.BoxOffice : 'N/A',
        production: omdbMovie.Production !== 'N/A' ? omdbMovie.Production : 'N/A',
        website: omdbMovie.Website !== 'N/A' ? omdbMovie.Website : null,
        ratings: omdbMovie.Ratings || []
    };
};

/**
 * Format search results from OMDb
 * @param {Array} searchResults - Array of search results from OMDb
 * @returns {Array} Formatted movie objects
 */
export const formatOMDbSearchResults = (searchResults) => {
    if (!searchResults || !Array.isArray(searchResults)) {
        return [];
    }

    return searchResults.map(movie => ({
        id: movie.imdbID,
        imdbId: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        type: movie.Type,
        image: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'
    }));
};

export default omdbApi;
