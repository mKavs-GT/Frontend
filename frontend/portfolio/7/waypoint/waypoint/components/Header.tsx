
import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import Logo from './Logo';

interface HeaderProps {
  setPage: (page: Page) => void;
  currentPage: Page;
}

const NavLink: React.FC<{
  pageName: Page;
  currentPage: Page;
  setPage: (page: Page) => void;
  children: React.ReactNode;
}> = ({ pageName, currentPage, setPage, children }) => {
  const isActive = currentPage === pageName;
  return (
    <button
      onClick={() => setPage(pageName)}
      className={`px-4 py-2 rounded-full transition-all duration-300 text-sm md:text-base ${isActive
        ? 'bg-waypoint-primary text-white shadow-lg'
        : 'text-gray-300 hover:text-white hover:bg-white/10'
        }`}
    >
      {children}
    </button>
  );
};

export default function Header({ setPage, currentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleNavClick = (page: Page) => {
    setPage(page);
    setIsMenuOpen(false);
  };

  const MobileNavLink: React.FC<{ pageName: Page; children: React.ReactNode; }> = ({ pageName, children }) => {
    const isActive = currentPage === pageName;
    return (
      <button
        onClick={() => handleNavClick(pageName)}
        className={`text-3xl font-bold transition-colors duration-300 ${isActive
          ? 'text-transparent bg-clip-text bg-gradient-to-r from-waypoint-accent to-waypoint-primary'
          : 'text-gray-300 hover:text-white'
          }`}
      >
        {children}
      </button>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <button
              onClick={() => {
                if (currentPage === 'home') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setPage('home');
                }
              }}
              className="hover:opacity-80 transition-opacity focus:outline-none"
              aria-label="Go to Home"
            >
              <Logo className="h-8 w-auto" showText={true} />
            </button>
          </div>

          {/* Center: Navigation */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-800/50 p-1 rounded-full">
            <NavLink pageName="home" currentPage={currentPage} setPage={setPage}>Home</NavLink>
            <NavLink pageName="explore" currentPage={currentPage} setPage={setPage}>Explore</NavLink>
            <NavLink pageName="journal" currentPage={currentPage} setPage={setPage}>Journal</NavLink>
            <NavLink pageName="tripplanner" currentPage={currentPage} setPage={setPage}>Trip Planner</NavLink>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex-1 hidden md:flex items-center justify-end space-x-4">
            <button onClick={() => setPage('login')} className="text-gray-300 hover:text-white transition-colors duration-300 text-sm md:text-base">Login</button>
            <button onClick={() => setPage('signup')} className="bg-gradient-to-r from-waypoint-primary to-waypoint-darkest text-white px-5 py-2 rounded-full hover:shadow-[0_0_15px_rgba(166,101,165,0.4)] transition-all duration-300 text-sm md:text-base font-bold">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button - visible only on mobile */}
          <div className="md:hidden flex-1 flex justify-end relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white text-2xl focus:outline-none p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}></i>
            </button>

            {/* Dropdown Menu - Compact & Smooth */}
            <div
              className={`absolute top-full right-0 mt-2 w-64 bg-waypoint-darkest/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 origin-top-right z-[100] ${isMenuOpen
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
            >
              <div className="p-4 flex flex-col space-y-2">
                <button onClick={() => handleNavClick('home')} className={`w-full text-left p-3 rounded-xl transition-colors ${currentPage === 'home' ? 'bg-waypoint-primary/20 text-waypoint-accent font-bold' : 'text-gray-300 hover:bg-white/5'}`}>Home</button>
                <button onClick={() => handleNavClick('explore')} className={`w-full text-left p-3 rounded-xl transition-colors ${currentPage === 'explore' ? 'bg-waypoint-primary/20 text-waypoint-accent font-bold' : 'text-gray-300 hover:bg-white/5'}`}>Explore</button>
                <button onClick={() => handleNavClick('journal')} className={`w-full text-left p-3 rounded-xl transition-colors ${currentPage === 'journal' ? 'bg-waypoint-primary/20 text-waypoint-accent font-bold' : 'text-gray-300 hover:bg-white/5'}`}>Journal</button>
                <button onClick={() => handleNavClick('tripplanner')} className={`w-full text-left p-3 rounded-xl transition-colors ${currentPage === 'tripplanner' ? 'bg-waypoint-primary/20 text-waypoint-accent font-bold' : 'text-gray-300 hover:bg-white/5'}`}>Trip Planner</button>

                <div className="border-t border-white/10 my-2 pt-2 space-y-2">
                  <button onClick={() => handleNavClick('login')} className="w-full text-left p-3 text-gray-400 hover:text-white transition-colors">Login</button>
                  <button onClick={() => handleNavClick('signup')} className="w-full p-3 bg-gradient-to-r from-waypoint-primary to-waypoint-darkest text-white font-extrabold rounded-xl shadow-lg border border-white/10 hover:shadow-waypoint-primary/30 transition-all">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
