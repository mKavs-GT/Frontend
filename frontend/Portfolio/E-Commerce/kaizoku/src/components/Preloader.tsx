import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

export const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            // Play load.mp3 at 60% volume when preloader completes
            try {
              const audioUrl = new URL('../assets/load.mp3', import.meta.url).href;
              const audio = new Audio(audioUrl);
              audio.volume = 0.02;
              audio.play().catch(e => {
                console.warn('Autoplay blocked. Sound will play on first click.', e);
                const playOnClick = () => {
                  audio.play();
                  window.removeEventListener('click', playOnClick);
                };
                window.addEventListener('click', playOnClick);
              });
            } catch (error) {
              console.error('Error playing audio:', error);
            }
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFB7C5]"
        >
          <div className="flex flex-col items-center gap-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-32 h-32 md:w-48 md:h-48"
            >
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </motion.div>

            <div className="flex flex-col items-center gap-6 w-64 md:w-80">
              <div className="w-full h-[2px] bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 font-medium tracking-[0.3em] uppercase text-[10px] md:text-xs"
              >
                Smooth Sailing
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
