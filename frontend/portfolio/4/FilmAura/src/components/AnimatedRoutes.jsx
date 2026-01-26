import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '../pages/Home';
import Movies from '../pages/Movies';
import TVShows from '../pages/TVShows';
import Anime from '../pages/Anime';
import Profile from '../pages/Profile';
import Search from '../pages/Search';
import GoogleLogin from '../pages/GoogleLogin';
import MovieDetails from '../pages/MovieDetails';
import PageTransition from './PageTransition';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/movie/:id" element={<PageTransition><MovieDetails /></PageTransition>} />
                <Route path="/movies" element={<PageTransition><Movies /></PageTransition>} />
                <Route path="/tv-shows" element={<PageTransition><TVShows /></PageTransition>} />
                <Route path="/anime" element={<PageTransition><Anime /></PageTransition>} />
                <Route path="/watch-later" element={<PageTransition><Profile /></PageTransition>} />
                <Route path="/categories" element={<PageTransition><Search /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
                <Route path="/search" element={<PageTransition><Search /></PageTransition>} />
                <Route path="/google-login" element={<PageTransition><GoogleLogin /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
