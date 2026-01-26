
import React from 'react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps & { showText?: boolean }> = ({ className = '', onClick, showText = true }) => {
  return (
    <div
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={`flex items-center justify-center gap-3 ${className}`}
      aria-label="WAYPOINT Logo"
    >
      <div className="h-full items-center flex">
        <svg viewBox="0 0 200 120" className="h-full w-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] overflow-visible">
          <defs>
            <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#d1d1d1" />
              <stop offset="50%" stopColor="#f8f8f8" />
              <stop offset="70%" stopColor="#b0b0b0" />
              <stop offset="100%" stopColor="#707070" />
            </linearGradient>
            <filter id="gloss">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lightingColor="#ffffff" result="spec">
                <fePointLight x="-50" y="-50" z="300" />
              </feSpecularLighting>
              <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />
              <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          </defs>
          <path
            d="M100 5 L118 45 C155 40, 185 45, 195 50 C185 70, 145 95, 118 115 L100 100 L82 115 C55 95, 15 70, 5 50 C15 45, 45 40, 82 45 Z"
            fill="url(#metal-grad)"
            filter="url(#gloss)"
          />
        </svg>
      </div>
      {showText && (
        <span className="text-xl md:text-2xl font-light tracking-[0.3em] text-white/90 mb-1">
          WAYPOINT
        </span>
      )}
    </div>
  );
};

export default Logo;
