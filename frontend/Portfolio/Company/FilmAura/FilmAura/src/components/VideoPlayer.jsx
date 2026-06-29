import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaExpand, FaCompress } from 'react-icons/fa';
import { getMovieEmbedUrl, getTVEmbedUrl, getImdbIdFromTmdb } from '../services/vidSrcApi';
import '../styles/VideoPlayer.css';

const VideoPlayer = ({ movie, onClose, onProgressUpdate }) => {
    const [embedUrl, setEmbedUrl] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVideo = async () => {
            setLoading(true);

            try {
                let url;
                let finalId = movie.imdbId;

                // Determine if it's a TV show
                const isTV = movie.Type === 'series' ||
                    movie.type === 'series' ||
                    movie.mediaType === 'tv' ||
                    (typeof movie.duration === 'string' && (movie.duration.includes('Season') || movie.duration.includes('Series')));

                // If no direct IMDB ID, check other sources
                if (!finalId) {
                    if (movie.id && typeof movie.id === 'string' && movie.id.startsWith('tt')) {
                        // movie.id is an IMDB ID
                        finalId = movie.id;
                    } else if (movie.id || movie.tmdbId) {
                        // Use TMDB ID to look up IMDB ID
                        const tmdbId = movie.id || movie.tmdbId;
                        const mediaType = isTV ? 'tv' : 'movie';
                        const fetchedImdbId = await getImdbIdFromTmdb(tmdbId, mediaType);
                        finalId = fetchedImdbId || tmdbId;
                    }
                }

                if (finalId) {
                    const options = {
                        autoplay: 1,
                        ds_lang: 'en'
                    };

                    if (isTV) {
                        const season = movie.season || 1;
                        const episode = movie.episode || 1;
                        url = getTVEmbedUrl(finalId, season, episode, options);
                    } else {
                        url = getMovieEmbedUrl(finalId, options);
                    }
                }

                setEmbedUrl(url);
            } catch (error) {
                console.error('Error loading video:', error);
            } finally {
                setLoading(false);
            }
        };

        if (movie) {
            loadVideo();
        }
    }, [movie]);

    // Track watching progress
    const secondsWatchedRef = useRef(0);
    const lastMovieIdRef = useRef(null);

    useEffect(() => {
        if (!onProgressUpdate || loading || !movie) return;

        const movieId = movie.imdbID || movie.id;

        // Only initialize/reset if movie ID changed
        if (lastMovieIdRef.current !== movieId) {
            lastMovieIdRef.current = movieId;

            const parseDuration = (durationStr) => {
                if (!durationStr || typeof durationStr !== 'string') return 120;
                const hoursMatch = durationStr.match(/(\d+)h/);
                const minsMatch = durationStr.match(/(\d+)m/);
                const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
                const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
                return (hours * 60) + mins || 120;
            };

            const totalMinutes = parseDuration(movie.duration || movie.Runtime);
            const totalSeconds = totalMinutes * 60;

            secondsWatchedRef.current = movie.progress ? (movie.progress / 100) * totalSeconds : 0;

            const interval = setInterval(() => {
                secondsWatchedRef.current += 5;
                const currentProgress = Math.min(Math.round((secondsWatchedRef.current / totalSeconds) * 100), 100);
                onProgressUpdate(currentProgress);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [loading, movie, onProgressUpdate]);

    const toggleFullscreen = () => {
        const playerElement = document.querySelector('.video-player-modal');

        if (!isFullscreen) {
            if (playerElement.requestFullscreen) {
                playerElement.requestFullscreen();
            } else if (playerElement.webkitRequestFullscreen) {
                playerElement.webkitRequestFullscreen();
            } else if (playerElement.msRequestFullscreen) {
                playerElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }

        setIsFullscreen(!isFullscreen);
    };

    if (!movie) return null;

    return (
        <div className="video-player-modal" onClick={onClose}>
            <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
                <div className="video-player-header">
                    <h2>{movie.title}</h2>
                    <div className="video-player-controls">
                        <button
                            className="control-btn"
                            onClick={toggleFullscreen}
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        >
                            {isFullscreen ? <FaCompress /> : <FaExpand />}
                        </button>
                        <button className="control-btn close-btn" onClick={onClose} title="Close">
                            <FaTimes />
                        </button>
                    </div>
                </div>

                <div className="video-player-content">
                    {loading ? (
                        <div className="video-loading">
                            <div className="spinner"></div>
                            <p>Loading video...</p>
                        </div>
                    ) : (
                        <iframe
                            src={embedUrl}
                            title={movie.title}
                            frameBorder="0"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            className="video-iframe"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
