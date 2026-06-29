import React, { createContext, useState, useContext, useEffect } from 'react';

const WatchLaterContext = createContext();

export const useWatchLater = () => useContext(WatchLaterContext);

export const WatchLaterProvider = ({ children }) => {
    const [watchLater, setWatchLater] = useState(() => {
        try {
            const saved = localStorage.getItem('watchLater');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading watch later list:', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('watchLater', JSON.stringify(watchLater));
        } catch (error) {
            console.error('Error saving watch later list:', error);
        }
    }, [watchLater]);

    const addToWatchLater = (movie) => {
        setWatchLater((prev) => {
            if (prev.some(item => item.id === movie.id)) {
                return prev; // Already in list
            }
            return [...prev, movie];
        });
    };

    const removeFromWatchLater = (movieId) => {
        setWatchLater((prev) => prev.filter(item => item.id !== movieId));
    };

    const isInWatchLater = (movieId) => {
        return watchLater.some(item => item.id === movieId);
    };

    return (
        <WatchLaterContext.Provider value={{ watchLater, addToWatchLater, removeFromWatchLater, isInWatchLater }}>
            {children}
        </WatchLaterContext.Provider>
    );
};
