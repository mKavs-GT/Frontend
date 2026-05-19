import React, { createContext, useState, useContext, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('filmaura_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [watchList, setWatchList] = useState(() => {
        const savedList = localStorage.getItem('filmaura_watchlist');
        return savedList ? JSON.parse(savedList) : [];
    });
    const [continueWatching, setContinueWatching] = useState(() => {
        const savedContinue = localStorage.getItem('filmaura_continue');
        return savedContinue ? JSON.parse(savedContinue) : [];
    });
    const [notification, setNotification] = useState({ show: false, message: '', type: 'added' });

    // Persist to localStorage whenever state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('filmaura_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('filmaura_user');
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('filmaura_watchlist', JSON.stringify(watchList));
    }, [watchList]);

    useEffect(() => {
        localStorage.setItem('filmaura_continue', JSON.stringify(continueWatching));
    }, [continueWatching]);

    const showNotification = (message, type = 'added') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    const login = (userData) => {
        setUser(userData);
        setIsAuthModalOpen(false);
    };

    const logout = () => {
        setUser(null);
        setWatchList([]);
        setContinueWatching([]);
        localStorage.removeItem('filmaura_user');
        localStorage.removeItem('filmaura_watchlist');
        localStorage.removeItem('filmaura_continue');
    };

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const addToWatchList = (movie) => {
        if (!user) {
            openAuthModal();
            return;
        }
        if (!watchList.some(item => item.id === movie.id)) {
            setWatchList([...watchList, movie]);
            showNotification(`Added ${movie.title} to My List`, 'added');
        }
    };

    const removeFromWatchList = (movieId) => {
        const movie = watchList.find(item => item.id === movieId);
        setWatchList(watchList.filter(item => item.id !== movieId));
        if (movie) {
            showNotification(`Removed ${movie.title} from My List`, 'removed');
        }
    };

    const updateProfile = (profileData) => {
        setUser(prev => ({ ...prev, ...profileData }));
        showNotification('Profile updated successfully', 'added');
    };

    const addToContinueWatching = (movie, progress = 0) => {
        const existingIndex = continueWatching.findIndex(item => item.id === movie.id);
        const watchItem = {
            ...movie,
            progress: progress,
            lastWatched: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            // Update existing item
            const updated = [...continueWatching];
            updated[existingIndex] = watchItem;
            setContinueWatching(updated);
        } else {
            // Add new item to the beginning
            setContinueWatching([watchItem, ...continueWatching]);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthModalOpen, openAuthModal, closeAuthModal, watchList, addToWatchList, removeFromWatchList, updateProfile, continueWatching, addToContinueWatching }}>
            {children}
            <div className={`toast-notification ${notification.type} ${notification.show ? 'show' : ''}`}>
                <span className="toast-icon">
                    {notification.type === 'added' ? <FaCheckCircle /> : <FaExclamationCircle />}
                </span>
                {notification.message}
            </div>
        </AuthContext.Provider>
    );
};
