
import React from 'react';
import { Page } from '../types';
import Logo from './Logo';

interface FooterProps {
  setPage: (page: Page) => void;
}

export default function Footer({ setPage }: FooterProps) {
  const navLinks: { name: string; page: Page }[] = [
    { name: 'Home', page: 'home' },
    { name: 'Explore Destinations', page: 'explore' },
    { name: 'Your Journal', page: 'journal' },
    { name: 'Plan Your Trip', page: 'tripplanner' },
  ];

  return (
    <footer className="bg-gradient-to-t from-black/50 to-transparent text-gray-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <button onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:opacity-80 transition-opacity mb-2">
              <Logo className="h-12 w-auto" showText={true} />
            </button>
            <p className="text-sm text-gray-400">Discover the Hidden Wonders of the World.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Navigate</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.page}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setPage(link.page); }} className="hover:text-waypoint-accent transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); setPage('login'); }} className="hover:text-waypoint-accent transition-colors duration-300">Login</a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); setPage('signup'); }} className="hover:text-waypoint-accent transition-colors duration-300">Sign Up</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4 text-xl">
              <a href="#" className="hover:text-waypoint-accent transition-colors duration-300"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="hover:text-waypoint-accent transition-colors duration-300"><i className="fab fa-instagram"></i></a>
              <a href="#" className="hover:text-waypoint-accent transition-colors duration-300"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-waypoint-accent transition-colors duration-300"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p className="mb-2">Copyrights Reserved © mKavs Global Tech</p>
          <p className="text-xs opacity-60 italic">This is a Sample website and not used for any other purposes</p>
        </div>
      </div>
    </footer>
  );
}
