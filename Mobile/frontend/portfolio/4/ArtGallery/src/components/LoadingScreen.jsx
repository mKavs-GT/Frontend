import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/LoadingScreen.css';

const LoadingScreen = ({ onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 3000); // Total duration of loading

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="logo-container">
        <h1 className="loading-logo">FilmAura</h1>
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
