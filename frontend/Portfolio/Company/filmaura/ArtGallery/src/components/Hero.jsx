import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import '../styles/Hero.css';
import endgamePoster from '../assets/avengers-endgame.jpg';
import lotrPoster from '../assets/lotr-return-king.jpg';

const Hero = () => {
    const navigate = useNavigate();
    const { addToWatchList, removeFromWatchList, watchList } = useAuth();
    const featuredMovies = [
        {
            id: "tt6443346",
            title: "Black Adam",
            description: "Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods—and imprisoned just as quickly—Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.",
            image: "https://4kwallpapers.com/images/walls/thumbs_3t/8727.jpg",
            rating: "8.1",
            year: "2022",
            duration: "2h 5m",
            match: "98% Match"
        },
        {
            id: "tt1630029",
            title: "Avatar: The Way of Water",
            description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
            image: "https://images.wallpapersden.com/image/download/avatar-the-way-of-water-poster_bW1mZ2qUmZqaraWkpJRoZW1urWZoams.jpg",
            rating: "7.6",
            year: "2022",
            duration: "3h 12m",
            match: "95% Match"
        },
        {
            id: "tt1745960",
            title: "Top Gun: Maverick",
            description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
            image: "https://4kwallpapers.com/images/walls/thumbs_3t/8210.jpg",
            rating: "8.3",
            year: "2022",
            duration: "2h 11m",
            match: "99% Match"
        },
        // Additional movies from mockData
        {
            id: "tt4154796",
            title: "Avengers: Endgame",
            description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
            image: endgamePoster,
            rating: "8.4",
            year: "2019",
            duration: "3h 1m",
            match: "99% Match"
        },
        {
            id: "tt0167260",
            title: "The Lord of the Rings: The Return of the King",
            description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            image: "https://images7.alphacoders.com/112/1123161.jpg",
            rating: "9.0",
            year: "2003",
            duration: "3h 21m",
            match: "99% Match"
        },
        {
            id: "tt0076759",
            title: "Star Wars: Episode IV - A New Hope",
            description: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.",
            image: "https://images6.alphacoders.com/613/thumb-1920-613328.jpg",
            rating: "8.6",
            year: "1977",
            duration: "2h 1m",
            match: "97% Match"
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const activeMovie = featuredMovies[activeIndex];

    const isInWatchList = watchList && watchList.some(item => item.id === activeMovie.id);

    const handleListAction = () => {
        if (isInWatchList) {
            removeFromWatchList(activeMovie.id);
        } else {
            addToWatchList(activeMovie);
        }
    };

    // Auto-scroll logic
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % featuredMovies.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [activeIndex]);

    // Dynamic font size based on title length
    const getTitleClass = (title) => {
        if (title.length > 30) return 'hero-title-long'; // e.g., LOTR
        if (title.length > 20) return 'hero-title-medium'; // e.g., Avatar: Way of Water
        return 'hero-title-short'; // e.g., Black Adam
    };

    return (
        <div className="hero">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeMovie.id}
                    className="hero-background"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 1.5,
                        ease: [0.33, 1, 0.68, 1] // Power4.easeOut equivalent
                    }}
                >
                    <img src={activeMovie.image} alt={activeMovie.title} className="hero-bg-image" />
                    <div className="hero-gradient-overlay"></div>
                </motion.div>
            </AnimatePresence>

            <div className="container hero-container-grid">
                <div className="hero-content">
                    <motion.h1
                        className={`hero-title ${getTitleClass(activeMovie.title)}`}
                        initial={{ y: 30, opacity: 0, filter: 'blur(10px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        transition={{
                            delay: 0.8, // Wait for background to partially reveal
                            duration: 0.8,
                            ease: "easeOut"
                        }}
                    >
                        {activeMovie.title}
                    </motion.h1>

                    <motion.div
                        className="hero-meta"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <div className="meta-item rating">
                            <FaStar className="star-icon" />
                            <span>IMDb {activeMovie.rating}</span>
                        </div>
                        <span className="meta-item">{activeMovie.year}</span>
                        <span className="meta-item">{activeMovie.duration}</span>
                        <span className="match-score">{activeMovie.match}</span>
                    </motion.div>

                    <motion.p
                        className="hero-description"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                    >
                        {activeMovie.description}
                    </motion.p>

                    <motion.div
                        className="hero-actions-wrapper"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                    >
                        <div className="hero-actions">
                            <button
                                className="btn btn-primary btn-lg flex-center"
                                onClick={() => navigate(`/movie/${activeMovie.id}`, { state: { autoPlay: true } })}
                            >
                                <FaPlay style={{ marginRight: '10px' }} />
                                Play
                            </button>
                            <button
                                className={`btn btn-glass flex-center ${isInWatchList ? 'active' : ''}`}
                                onClick={handleListAction}
                                title={isInWatchList ? "Remove from My List" : "Add to My List"}
                            >
                                {isInWatchList ? <FaCheck /> : <FaPlus />}
                            </button>
                        </div>

                        {/* Thumbnails moved next to buttons */}
                        <div className="hero-thumbnails-row">
                            {featuredMovies.map((movie, idx) => (
                                <div
                                    key={movie.id}
                                    className={`thumbnail-card-small ${idx === activeIndex ? 'active' : ''}`}
                                    onClick={() => setActiveIndex(idx)}
                                >
                                    <img src={movie.image} alt={movie.title} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
