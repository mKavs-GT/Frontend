import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'light') {
            setIsDark(false);
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            setIsDark(true);
            document.documentElement.removeAttribute('data-theme');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
            style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                position: 'relative',
            }}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: isDark ? 0 : 90,
                    scale: isDark ? 1 : 0,
                    opacity: isDark ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute' }}
            >
                {/* Moon Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    rotate: isDark ? -90 : 0,
                    scale: isDark ? 0 : 1,
                    opacity: isDark ? 0 : 1
                }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute' }}
            >
                {/* Sun Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
