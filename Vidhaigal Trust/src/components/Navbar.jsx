import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX } from 'react-icons/fi';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.initiatives'), path: '/initiatives' },
    { name: t('nav.gallery'), path: '/gallery' },
    { 
      name: t('nav.tracker'), 
      shortName: t('nav.tracker_short', 'Tracker'), 
      path: '/tracker' 
    },
    { 
      name: 'Impact Map', 
      shortName: 'Map',
      path: '/impact' 
    },
    { name: t('nav.contact'), path: '/contact' },
    { name: 'Partner With Us', shortName: 'Partner', path: '/partner' },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* SECTION 1: LOGO (left) */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="https://placehold.co/40x40/2D6A4F/FFF?text=V" alt="Vidhaigal Logo" className="w-9 h-9 rounded-full" />
          <span className="font-bold text-xl text-primary hidden sm:block">
            Vidhaigal
          </span>
        </Link>

        {/* SECTION 2: NAV LINKS (center) */}
        <div className={`hidden md:flex items-center gap-0.5 flex-1 justify-center ${i18n.language === 'ta' ? 'text-[12px]' : 'text-[13px]'}`}>
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap relative ${
                  isActive 
                    ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-secondary after:rounded-full' 
                    : 'text-gray-700 hover:text-primary hover:bg-green-50'
                }`
              }
            >
              {link.shortName ? (
                <>
                  <span className="hidden xl:inline">{link.name}</span>
                  <span className="xl:hidden">{link.shortName}</span>
                </>
              ) : (
                link.name
              )}
            </NavLink>
          ))}
        </div>

        {/* SECTION 3: RIGHT ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="min-w-[52px] flex justify-center">
            <LanguageSwitcher />
          </div>
          
          <ThemeToggle />
          
          <Link
            to="/donate"
            className="hidden sm:flex items-center px-4 py-2 bg-secondary text-text-dark font-bold rounded-full text-sm hover:bg-yellow-400 transition-all whitespace-nowrap shrink-0"
          >
            {t('nav.donate')}
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition focus:outline-none"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FiX size={24} className="text-gray-700" /> : <FiMenu size={24} className="text-gray-700" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive 
                      ? 'bg-light-green text-primary' 
                      : 'text-gray-700 hover:bg-green-50 hover:text-primary'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/donate"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full mt-3 px-4 py-3 bg-secondary text-text-dark font-bold rounded-xl text-center transition-all hover:bg-yellow-400"
            >
              {t('nav.donate')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
