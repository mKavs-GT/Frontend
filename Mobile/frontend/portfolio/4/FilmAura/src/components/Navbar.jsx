import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaBell, FaBars, FaTimes, FaHome, FaFilm, FaTv, FaClock, FaList, FaUser, FaDragon } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, openAuthModal } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            navigate(`/categories?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery(''); // Clear search after navigating
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', icon: <FaHome /> },
        { name: 'Movies', path: '/movies', icon: <FaFilm /> },
        { name: 'TV Shows', path: '/tv-shows', icon: <FaTv /> },
        { name: 'Anime', path: '/anime', icon: <FaDragon /> },
        { name: 'Watch Later', path: '/watch-later', icon: <FaClock /> },
        { name: 'Categories', path: '/categories', icon: <FaList /> },
        { name: 'My Profile', path: '/profile', icon: <FaUser /> },
    ];

    return (
        <motion.nav
            className={`navbar ${isScrolled ? 'scrolled' : ''}`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        >
            <div className="navbar-container container">
                <div className="navbar-logo">
                    <Link to="/" className="navbar-logo-link">
                        <img src={logo} alt="FilmAura Logo" className="logo-img" />
                        <span className="logo-text">FILMAURA</span>
                    </Link>
                </div>

                <div
                    className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}
                    onMouseEnter={() => window.innerWidth <= 768 && setIsMobileMenuOpen(true)}
                    onMouseLeave={() => window.innerWidth <= 768 && setIsMobileMenuOpen(false)}
                >
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">{link.icon}</span>
                            <span className="nav-text">{link.name}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="navbar-actions">
                    <div className={`search-box ${isSearchOpen ? 'expanded' : ''}`}>
                        <button className="action-icon search-trigger" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                            <FaSearch />
                        </button>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Titles, people, genres"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                        />
                    </div>
                    <div className="action-icon">
                        <FaBell />
                    </div>

                    {user ? (
                        <Link to="/profile" className="user-avatar-link">
                            <img src={user.avatar} alt="User" className="user-avatar" />
                        </Link>
                    ) : (
                        <button className="btn-signin" onClick={openAuthModal}>
                            Sign In
                        </button>
                    )}

                    <div
                        className="mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        onMouseEnter={() => window.innerWidth <= 768 && setIsMobileMenuOpen(true)}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
