import React from 'react';
import { Link } from 'react-router-dom';

export const FooterSection: React.FC = () => {
  return (
    <footer className="bg-[#0C0C0C] text-white py-20 px-6 sm:px-10 md:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">KAiZOKU</h2>
            <p className="text-white/40 font-mono text-xs leading-relaxed max-w-[240px]">
              Kowai Core — Japanese-inspired silhouettes for the modern outlaw. Engineering for the female gaze.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <span className="text-[10px] font-bold">IG</span>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <span className="text-[10px] font-bold">TK</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <span className="text-[10px] font-bold">X</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Navigation</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/products" className="text-sm font-medium hover:text-[#DFA09D] transition-colors">Shop All</Link></li>
              <li><Link to="/products" className="text-sm font-medium hover:text-[#DFA09D] transition-colors">Trending</Link></li>
              <li><Link to="/about" className="text-sm font-medium hover:text-[#DFA09D] transition-colors">About Us</Link></li>
              <li><Link to="/about" className="text-sm font-medium hover:text-[#DFA09D] transition-colors">Mission</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Support</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="text-sm font-medium hover:text-[#DFA09D] transition-colors">Shipping</Link></li>
              <li><Link to="/" className="text-sm font-medium hover:text-[#DFA09D] transition-colors">Returns</Link></li>
              <li><Link to="/" className="text-sm font-medium hover:text-[#DFA09D] transition-colors">FAQ</Link></li>
              <li><Link to="/" className="text-sm font-medium hover:text-[#DFA09D] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Join the Crew</h4>
            <p className="text-white/40 text-xs leading-relaxed">
              Sign up for early access to "Kowai Couture" drops.
            </p>
            <div className="flex mt-2">
              <input 
                type="email" 
                placeholder="EMAIL@ADDRESS.COM" 
                className="bg-transparent border-b border-white/20 py-2 text-xs font-mono w-full focus:outline-none focus:border-[#DFA09D] transition-colors"
              />
              <button 
                onClick={() => alert("Thanks for subscribing!")}
                className="border-b border-white/20 px-4 hover:text-[#DFA09D] transition-colors"
              >
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6">
          <p className="text-[10px] text-white/20 font-mono tracking-widest">
            © 2026 KAIZOKU — ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-8">
            <Link to="/" className="text-[10px] text-white/20 hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</Link>
            <Link to="/" className="text-[10px] text-white/20 hover:text-white transition-colors uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
