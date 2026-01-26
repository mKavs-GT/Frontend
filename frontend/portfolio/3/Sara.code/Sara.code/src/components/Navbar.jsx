import { useState, useEffect } from 'react';
import './Navbar.css';
import Logo from './Logo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseMove = (e) => {
    const link = e.currentTarget;
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    link.style.setProperty('--mouse-x', `${x}px`);
    link.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="#" className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo className="logo-icon" />
          SARA<span className="logo-dot">.CODES</span>
        </a>

        <ul className="navbar-links">
          <li>
            <a className="nav-link" onMouseMove={handleMouseMove} onClick={() => scrollToSection('about')}>
              <div className="nav-link-glow"></div>
              About
            </a>
          </li>
          <li>
            <a className="nav-link" onMouseMove={handleMouseMove} onClick={() => scrollToSection('projects')}>
              <div className="nav-link-glow"></div>
              Work
            </a>
          </li>
          <li>
            <a className="nav-link" onMouseMove={handleMouseMove} onClick={() => scrollToSection('stats')}>
              <div className="nav-link-glow"></div>
              Stats
            </a>
          </li>
          <li>
            <a className="nav-cta" onMouseMove={handleMouseMove} onClick={() => scrollToSection('contact')}>
              <div className="nav-link-glow"></div>
              Hit Me Up
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
