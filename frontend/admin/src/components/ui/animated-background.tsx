"use client";

import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950" />

      {/* Floating Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 50, -50, 0],
          y: [0, -50, 50, 0, 0],
          scale: [1, 1.2, 1.1, 1, 1],
          opacity: [0.3, 0.5, 0.4, 0.3, 0.3],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 will-change-transform transform-gpu"
      />

      <motion.div
        animate={{
          x: [0, -70, -30, 0],
          y: [0, 80, -20, 0],
          scale: [1, 1.4, 1.1, 1],
          opacity: [0.2, 0.4, 0.3, 0.2],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
          delay: 2,
        }}
        className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 will-change-transform transform-gpu"
      />

      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, 40, 60, 0],
          scale: [1, 1.3, 1.1, 1],
          opacity: [0.2, 0.3, 0.25, 0.2],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
          delay: 5,
        }}
        className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] translate-y-1/2 will-change-transform transform-gpu"
      />
      
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    </div>
  );
};
