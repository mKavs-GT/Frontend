import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaStar, FaClock, FaCalendar, FaAward, FaTrophy } from 'react-icons/fa';
import VideoPlayer from '../components/VideoPlayer';
import imdbApi, { formatIMDbMovie, formatCastFromActors } from '../services/imdbApi';
import { useAuth } from '../context/AuthContext';
import '../styles/MovieDetails.css';

const MovieDetails = () => {
    const { id } = useParams(); // This is the IMDb ID
    const navigate = useNavigate();
    const location = useLocation();
    const { addToWatchList, removeFromWatchList, watchList, addToContinueWatching, continueWatching } = useAuth();
    const [movie, setMovie] = useState(null);

    // Get current progress if movie exists in continue watching
    const watchedInfo = movie && continueWatching ? continueWatching.find(item => item.id === movie.id) : null;
    const currentProgress = watchedInfo ? watchedInfo.progress : 0;

    const isInWatchList = movie && watchList && watchList.some(item => item.id === movie.id);

    const handleListAction = () => {
        if (isInWatchList) {
            removeFromWatchList(movie.id);
        } else {
            addToWatchList(movie);
        }
    };
    const [showPlayer, setShowPlayer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(1);

    // Update selected season when movie changes
    useEffect(() => {
        if (movie && movie.seasons && movie.seasons.length > 0) {
            setSelectedSeason(movie.seasons[0].seasonNumber);
        }
    }, [movie]);

    // Check for autoPlay in location state
    useEffect(() => {
        if (location.state?.autoPlay) {
            setShowPlayer(true);
        }
    }, [location.state]);

    const handleSeasonChange = (e) => {
        setSelectedSeason(Number(e.target.value));
    };

    useEffect(() => {
        const fetchMovieDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch movie details from CollectAPI IMDb
                const data = await imdbApi.searchById(id);

                if (!data.success) {
                    setError(data.message || 'Movie not found');
                    setLoading(false);
                    return;
                }

                // Format the movie data
                const formattedMovie = formatIMDbMovie(data);

                if (!formattedMovie) {
                    setError('Movie not found');
                    setLoading(false);
                    return;
                }

                // Add cast information
                if (formattedMovie.actors && formattedMovie.actors.length > 0) {
                    formattedMovie.cast = formatCastFromActors(data.result.Actors);
                }

                setMovie(formattedMovie);

            } catch (error) {
                console.error('Error fetching movie details:', error);
                if (error.message.includes('Rate limit')) {
                    setError('Rate limit exceeded. The free API tier has limited requests. Please try again later or upgrade your CollectAPI plan.');
                } else {
                    setError('Failed to load movie details. Please check your API key and try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMovieDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-large"></div>
                <p>Loading movie details...</p>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="error-container">
                <h2>Oops!</h2>
                <p>{error || 'Movie not found'}</p>
                <button className="btn-play-large" onClick={() => navigate('/')}>
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="movie-details-page">
            {/* Hero Section */}
            <div
                className="movie-hero"
                style={{ backgroundImage: `url(${movie.backdrop || movie.image})` }}
            >
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Back
                    </button>

                    <div className="hero-layout">
                        <div className="hero-poster">
                            <img src={movie.image} alt={movie.title} />
                        </div>

                        <div className="hero-info">
                            <h1 className="movie-title">{movie.title}</h1>
                            {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}

                            <div className="movie-meta-info">
                                <span className="meta-item rating-badge">
                                    <FaStar className="icon" /> {movie.imdbRating}
                                </span>
                                {movie.metascore !== 'N/A' && (
                                    <span className="meta-item metascore-badge">
                                        <FaTrophy className="icon" /> Metascore: {movie.metascore}
                                    </span>
                                )}
                                <span className="meta-item">
                                    <FaCalendar className="icon" /> {movie.year}
                                </span>
                                <span className="meta-item">
                                    <FaClock className="icon" /> {movie.runtime}
                                </span>
                                <span className="meta-badge">{movie.ageRating}</span>
                            </div>

                            <div className="hero-actions">
                                <button className="btn-play-large" onClick={() => {
                                    addToContinueWatching(movie, 0);
                                    setShowPlayer(true);
                                }}>
                                    <FaPlay /> Play Now
                                </button>
                                <button className={`btn-add-large ${isInWatchList ? 'active' : ''}`} onClick={handleListAction}>
                                    {isInWatchList ? <><FaCheck /> Added</> : <><FaPlus /> My List</>}
                                </button>
                            </div>

                            {/* Quick Info */}
                            <div className="quick-info">
                                {movie.director !== 'N/A' && (
                                    <div className="info-item">
                                        <span className="info-label">Director:</span>
                                        <span className="info-value">{movie.director}</span>
                                    </div>
                                )}
                                {movie.writers.length > 0 && (
                                    <div className="info-item">
                                        <span className="info-label">Writers:</span>
                                        <span className="info-value">{movie.writers.join(', ')}</span>
                                    </div>
                                )}
                                {movie.actors.length > 0 && (
                                    <div className="info-item">
                                        <span className="info-label">Stars:</span>
                                        <span className="info-value">{movie.actors.slice(0, 3).join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container movie-content">
                {/* Overview Section */}
                <section className="content-section">
                    <h2>Storyline</h2>
                    <p className="movie-overview">{movie.description}</p>

                    <div className="movie-details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Release Date</span>
                            <span className="detail-value">{movie.releaseDate}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Genres</span>
                            <span className="detail-value">
                                {movie.genres.map(g => g.name).join(', ') || 'N/A'}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Language</span>
                            <span className="detail-value">{movie.languages}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Country</span>
                            <span className="detail-value">{movie.productionCountries}</span>
                        </div>
                        {movie.boxOffice !== 'N/A' && (
                            <div className="detail-item">
                                <span className="detail-label">Box Office</span>
                                <span className="detail-value">{movie.boxOffice}</span>
                            </div>
                        )}
                        <div className="detail-item">
                            <span className="detail-label">IMDb Votes</span>
                            <span className="detail-value">{movie.imdbVotes} votes</span>
                        </div>
                        {movie.awards !== 'N/A' && (
                            <div className="detail-item awards-item">
                                <span className="detail-label">
                                    <FaAward /> Awards
                                </span>
                                <span className="detail-value">{movie.awards}</span>
                            </div>
                        )}
                        {movie.production !== 'N/A' && (
                            <div className="detail-item">
                                <span className="detail-label">Production</span>
                                <span className="detail-value">{movie.production}</span>
                            </div>
                        )}
                    </div>

                    {/* Ratings from different sources */}
                    {movie.ratings && movie.ratings.length > 0 && (
                        <div className="ratings-section">
                            <h3>Ratings</h3>
                            <div className="ratings-grid">
                                {movie.ratings.map((rating, index) => (
                                    <div key={index} className="rating-card">
                                        <span className="rating-source">{rating.Source}</span>
                                        <span className="rating-value">{rating.Value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Episodes Section - Only for Series */}
                {movie.seasons && movie.seasons.length > 0 && (
                    <section className="content-section">
                        <div className="season-header">
                            <h2>Episodes</h2>
                            <div className="season-selector">
                                <select value={selectedSeason} onChange={handleSeasonChange}>
                                    {movie.seasons.map(season => (
                                        <option key={season.seasonNumber} value={season.seasonNumber}>
                                            Season {season.seasonNumber} ({season.episodes ? season.episodes.length : 0} Episodes)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="episodes-list">
                            {movie.seasons
                                .find(s => s.seasonNumber === selectedSeason)
                                ?.episodes.map((episode, index) => (
                                    <div key={index} className="episode-card">
                                        <div className="episode-number">{index + 1}</div>
                                        <div className="episode-info">
                                            <h4>{episode.title}</h4>
                                            <p>{episode.plot}</p>
                                        </div>
                                        {episode.rating && (
                                            <div className="episode-rating">
                                                <FaStar /> {episode.rating}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </section>
                )}

                {/* Cast Section */}
                {movie.cast && movie.cast.length > 0 && (
                    <section className="content-section">
                        <h2>Cast</h2>
                        <div className="cast-list">
                            {movie.cast.map((actor, index) => (
                                <div key={index} className="cast-list-item">
                                    <span className="cast-name">{actor.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Video Player Modal */}
            {showPlayer && (
                <VideoPlayer
                    movie={{ ...movie, progress: currentProgress }}
                    onProgressUpdate={(newProgress) => addToContinueWatching(movie, newProgress)}
                    onClose={() => setShowPlayer(false)}
                />
            )}
        </div>
    );
};

export default MovieDetails;
