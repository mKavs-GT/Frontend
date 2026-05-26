import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  // CONFIGURATION: Set the start position here (e.g., -500, -100vw, etc.)
  const mascotStartPosition = -1300;
  const animationDuration = 3.5;
  const animationDelay = 0.5;

  return (
    <header className="relative pt-12 md:pt-20 flex flex-col md:flex-row justify-between items-start md:items-end min-h-[400px] md:min-h-[500px] overflow-hidden">
      {/* Text Content - Reveal Mask synchronized with Mascot */}
      <div className="flex flex-col flex-1 pb-16 md:pb-24 z-0">
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{
            duration: animationDuration * 0.8,
            delay: animationDelay + 0.2, // Starts shortly after mascot enters the frame
            ease: "linear"
          }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 leading-none uppercase">
            Digital Index
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light mt-6 leading-relaxed max-w-xl tracking-tight">
            A collection of high-fidelity solutions <br className="hidden md:block" />
            Built for the next era of the web.
          </p>
        </motion.div>
      </div>

      {/* Mascot Container - Fully opaque, 400px height, adjustable start position */}
      <motion.div
        initial={{ x: mascotStartPosition, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 25,
          damping: 20,
          duration: animationDuration,
          delay: animationDelay
        }}
        className="hidden lg:block absolute bottom-0 right-0 pointer-events-none translate-x-12 translate-y-2 z-10"
      >
        <img
          src="./mrv.png"
          alt="MRV Mascot"
          className="w-auto h-[400px] object-contain animate-pulse-subtle"
          style={{
            filter: 'grayscale(0.05) contrast(1.1)',
          }}
        />
      </motion.div>
    </header>
  );
};

export default Header;
