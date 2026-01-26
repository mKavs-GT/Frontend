import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ScrollReveal from './ScrollReveal';
import '../styles/MovieCard.css';

const MovieCard = ({ movie, showProgress }) => {
    const { addToWatchList, removeFromWatchList, watchList } = useAuth(); // Destructure properly inside the component
    const navigate = useNavigate();

    const isInWatchList = watchList && watchList.some(item => item.id === movie.id);

    const handleWatchNow = (e) => {
        e.stopPropagation();
        navigate(`/movie/${movie.id}`);
    };

    const handleListAction = (e) => {
        e.stopPropagation();
        if (isInWatchList) {
            removeFromWatchList(movie.id);
        } else {
            addToWatchList(movie);
        }
    };

    return (
        <ScrollReveal y={40} duration={0.7} width="auto">
            <div className="movie-card" onClick={handleWatchNow}>
                <img src={movie.image} alt={movie.title} className="card-image" />

                {showProgress && movie.progress !== undefined && (
                    <div className="card-progress-container">
                        <div
                            className="card-progress-bar"
                            style={{ width: `${movie.progress}%` }}
                        ></div>
                    </div>
                )}

                <div className="card-hover-info">
                    <div className="card-actions-row">
                        <button className="btn-watch-now" onClick={handleWatchNow}>
                            <FaPlay className="icon-play" /> Watch Now
                        </button>
                        <button className={`btn-add-list ${isInWatchList ? 'active' : ''}`} onClick={handleListAction} title={isInWatchList ? "Remove from My List" : "Add to My List"}>
                            {isInWatchList ? <FaCheck /> : <FaPlus />}
                        </button>
                    </div>

                    <div className="card-metadata-line">
                        <span className="meta-year">{movie.year || '2023'}</span>
                        <span className="meta-separator">•</span>
                        <span className="meta-age">{movie.ageRating || 'UA 13+'}</span>
                        <span className="meta-separator">•</span>
                        <span className="meta-duration">{movie.duration || '2h 10m'}</span>
                        <span className="meta-separator">•</span>
                        <span className="meta-langs">{movie.languages ? movie.languages.split(',')[0] + ' +More' : 'English +More'}</span>
                    </div>

                    <p className="card-description">
                        {movie.description || "Experience this cinematic masterpiece in high definition."}
                    </p>
                </div>
            </div>
        </ScrollReveal>
    );
};

export default MovieCard;
