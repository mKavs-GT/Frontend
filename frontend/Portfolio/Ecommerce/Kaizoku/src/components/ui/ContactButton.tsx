import React from 'react';
import { Link } from 'react-router-dom';

export const ContactButton: React.FC = () => {
  return (
    <Link
      to="/about"
      className="inline-block rounded-full text-[#1a1a1a] font-semibold uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base shadow-lg transition-transform hover:scale-105 active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 50%, #DFA09D 100%)',
        boxShadow: '0px 4px 20px rgba(223, 160, 157, 0.4)',
      }}
    >
      Contact Me
    </Link>
  );
};
