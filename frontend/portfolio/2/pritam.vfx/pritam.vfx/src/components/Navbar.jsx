import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/projects', label: 'Projects' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar__container">
                <div className="navbar__left">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        <motion.div
                            className="navbar__logo-wrapper"
                            initial="initial"
                            whileHover="hover"
                            style={{ display: 'flex', alignItems: 'center', gap: 'inherit' }}
                        >
                            <Logo size={40} className="navbar__logo-img" />
                            <span className="navbar__logo-text">pritam.vfx</span>
                        </motion.div>
                    </Link>

                    {/* Navbar Socials - positioned next to logo */}
                    <div className="navbar__socials">
                        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="navbar__social-link" aria-label="Pinterest">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.27 2.71 7.9 6.51 9.24-.09-.8-.17-2.02.03-2.89.18-.79 1.18-5.01 1.18-5.01s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.14-.83 3.33-.24.99.5 1.8 1.47 1.8 1.77 0 3.12-1.86 3.12-4.55 0-2.38-1.71-4.04-4.14-4.04-2.82 0-4.48 2.12-4.48 4.31 0 .85.33 1.77.74 2.27.08.1.09.18.07.28-.08.31-.25 1.02-.28 1.16-.04.18-.14.22-.32.14-1.2-.56-1.95-2.31-1.95-3.73 0-3.03 2.2-5.83 6.37-5.83 3.34 0 5.94 2.38 5.94 5.57 0 3.32-2.09 5.99-4.99 5.99-.98 0-1.9-.51-2.21-1.1l-.6 2.28c-.22.84-.8 1.89-1.19 2.52 1.12.35 2.31.54 3.54.54 5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="navbar__social-link" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="navbar__social-link" aria-label="X">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="navbar__social-link" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <ul className="navbar__links">
                    {navLinks.map((link) => (
                        <li key={link.path} style={{ position: 'relative' }}>
                            <Link
                                to={link.path}
                                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
                            >
                                {link.label}
                                {location.pathname === link.path && (
                                    <motion.span
                                        layoutId="navbar-pill"
                                        className="navbar__indicator"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 350,
                                            damping: 30
                                        }}
                                    />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                <div className="navbar__right">
                    <ThemeToggle />
                    <Link to="/contact" className="navbar__cta btn btn-primary">
                        Hire Me
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <motion.button
                    className={`navbar__toggle ${isMobileMenuOpen ? 'navbar__toggle--open' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    onMouseEnter={() => setIsMobileMenuOpen(true)}
                    aria-label="Toggle menu"
                    whileHover="hover"
                    initial="initial"
                >
                    <motion.span
                        variants={{
                            initial: { rotate: 0, y: 0 },
                            hover: { y: -2 },
                            open: { rotate: 45, y: 7 }
                        }}
                        animate={isMobileMenuOpen ? "open" : "initial"}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                    <motion.span
                        variants={{
                            initial: { opacity: 1, x: 0 },
                            hover: { x: 3 },
                            open: { opacity: 0, x: 20 }
                        }}
                        animate={isMobileMenuOpen ? "open" : "initial"}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                    <motion.span
                        variants={{
                            initial: { rotate: 0, y: 0 },
                            hover: { y: 2 },
                            open: { rotate: -45, y: -7 }
                        }}
                        animate={isMobileMenuOpen ? "open" : "initial"}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="navbar__mobile-menu"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        onMouseLeave={() => setIsMobileMenuOpen(false)}
                    >
                        <ul className="navbar__mobile-links">
                            {navLinks.map((link, index) => (
                                <motion.li
                                    key={link.path}
                                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                                >
                                    <Link
                                        to={link.path}
                                        className={`navbar__mobile-link ${location.pathname === link.path ? 'navbar__mobile-link--active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                        <motion.div
                            className="navbar__mobile-cta-container"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link to="/contact" className="navbar__mobile-cta btn btn-primary">
                                Hire Me
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
