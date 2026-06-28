// Helper function to format movie/TV data from TMDB API to our app format
export const formatMovieData = (movie) => {
    return {
        id: movie.id,
        title: movie.title || movie.name,
        image: movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image',
        backdrop: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : null,
        year: movie.release_date
            ? new Date(movie.release_date).getFullYear().toString()
            : movie.first_air_date
                ? new Date(movie.first_air_date).getFullYear().toString()
                : 'N/A',
        duration: movie.runtime
            ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
            : movie.episode_run_time && movie.episode_run_time[0]
                ? `${movie.episode_run_time[0]}m`
                : movie.number_of_seasons
                    ? `${movie.number_of_seasons} Season${movie.number_of_seasons > 1 ? 's' : ''}`
                    : 'N/A',
        imdbRating: movie.vote_average
            ? `IMDb ${movie.vote_average.toFixed(1)}`
            : 'N/A',
        match: movie.vote_average
            ? `${Math.round(movie.vote_average * 10)}% Match`
            : 'N/A',
        ageRating: movie.adult ? 'A' : 'UA 13+',
        languages: movie.original_language
            ? movie.original_language.toUpperCase()
            : 'English',
        description: movie.overview || 'No description available.',
        genres: movie.genres || [],
        popularity: movie.popularity || 0,
        mediaType: movie.media_type || (movie.title ? 'movie' : 'tv')
    };
};

// Helper to format multiple items
export const formatMovieList = (movies) => {
    return movies.map(formatMovieData);
};

// Helper to get runtime in readable format
export const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Helper to get age rating from certification
export const getAgeRating = (certifications, country = 'US') => {
    if (!certifications || !certifications.results) return 'UA 13+';

    const countryCert = certifications.results.find(c => c.iso_3166_1 === country);
    if (countryCert && countryCert.release_dates && countryCert.release_dates[0]) {
        return countryCert.release_dates[0].certification || 'UA 13+';
    }

    return 'UA 13+';
};
