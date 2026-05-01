import React, { useState, useEffect } from 'react';
import { Instagram, Disc as Discord, Linkedin, User, Menu } from 'lucide-react';

const Navbar = () => {
  const [isDarkSection, setIsDarkSection] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Detect if we are over the dark section (BrandCTA)
      const brandCTA = document.getElementById('projects-exact');
      if (brandCTA) {
        const rect = brandCTA.getBoundingClientRect();
        // If the navbar (roughly 80px) is within the BrandCTA rect
        if (rect.top <= 50 && rect.bottom >= 50) {
          setIsDarkSection(true);
        } else {
          setIsDarkSection(false);
        }
      }

      // Show/Hide logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Text color based on section
  const textColorClass = isDarkSection ? 'text-white' : 'text-black';
  const hoverColorClass = isDarkSection ? 'hover:text-[#c7f908]' : 'hover:text-[#c7f908]';
  const borderColorClass = isDarkSection ? 'border-white/20' : 'border-black/20';

  return (
    <nav 
      id="main-toolbar"
      className={`fixed top-0 left-0 right-0 w-full z-[70] transition-all duration-500 ease-in-out px-4 py-4 md:px-10 md:py-6 bg-transparent ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="hidden md:flex items-center space-x-8 text-lg font-medium min-w-0 pointer-events-auto">
          <div className="space-x-6 whitespace-nowrap flex items-center">
            <a href="/" className={`text-lg ${textColorClass} ${hoverColorClass} transition-colors`}>Home</a>
            <a href="/about" className={`text-lg ${textColorClass} ${hoverColorClass} transition-colors`}>About</a>
            <a href="/#our-works" className={`text-lg ${textColorClass} ${hoverColorClass} transition-colors`}>Our Work</a>
            <a href="/branding" className={`text-lg ${textColorClass} ${hoverColorClass} transition-colors`}>Branding</a>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button className={`md:hidden ${textColorClass} p-2`}>
          <Menu size={28} />
        </button>
        
        <div className="hidden md:flex items-center space-x-8 text-lg font-medium min-w-0 ml-auto pointer-events-auto">
          <div className="space-x-6 whitespace-nowrap flex items-center">
            <a href="/pricing" className={`text-lg ${textColorClass} ${hoverColorClass} transition-colors`}>Pricing</a>
            <a href="/consult" className={`text-lg ${textColorClass} ${hoverColorClass} transition-colors`}>Book Us</a>
            <a href="/support" className={`text-lg ${textColorClass} ${hoverColorClass} transition-colors`}>Support</a>
            <a href="/login" className={`login-btn text-lg ${textColorClass} ${hoverColorClass} transition-colors font-bold uppercase tracking-widest border ${borderColorClass} px-6 py-2 rounded-full transition-all`}>Login</a>
          </div>
          
          <div className="flex space-x-4 text-xl">
            <a href="https://www.instagram.com/mkavsglobaltech/" target="_blank" rel="noreferrer"
               className={`${textColorClass} ${hoverColorClass} transition-transform hover:scale-110`}><Instagram size={20} /></a>
            <a href="https://discord.gg/KhnQfB6MrH" target="_blank" rel="noreferrer"
               className={`${textColorClass} ${hoverColorClass} transition-transform hover:scale-110`}><Discord size={20} /></a>
            <a href="https://www.linkedin.com/company/mkavs-global-tech/about/" target="_blank" rel="noreferrer"
               className={`${textColorClass} ${hoverColorClass} transition-transform hover:scale-110`}><Linkedin size={20} /></a>
            <a href="/profile" className={`${textColorClass} ${hoverColorClass} transition-transform hover:scale-110`}>
               <User size={20} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
