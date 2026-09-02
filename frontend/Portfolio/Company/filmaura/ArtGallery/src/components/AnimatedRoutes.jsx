import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '../pages/Home';
import ArtworkDetails from '../pages/ArtworkDetails';
import Profile from '../pages/Profile';
import Search from '../pages/Search';
import GoogleLogin from '../pages/GoogleLogin';
import PageTransition from './PageTransition';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/movie/:id" element={<PageTransition><ArtworkDetails /></PageTransition>} />
                <Route path="/artwork/:id" element={<PageTransition><ArtworkDetails /></PageTransition>} />
                <Route path="/movies" element={<PageTransition><Search /></PageTransition>} />
                <Route path="/tv-shows" element={<PageTransition><Search /></PageTransition>} />
                <Route path="/anime" element={<PageTransition><Search /></PageTransition>} />
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
