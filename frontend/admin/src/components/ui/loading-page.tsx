"use client";
import React from 'react';
import { motion } from 'framer-motion';

export function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617] overflow-hidden">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      
      <div className="relative flex flex-col items-center">
        {/* Logo Section with Scanning Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-14"
        >
          {/* Subtle logo backing glow */}
          <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full" />
          
          <div className="relative overflow-hidden p-4">
            <img 
              src="/mkavs-loading-logo.png" 
              alt="MKAVS" 
              className="w-80 h-auto relative z-10 brightness-110 contrast-110 opacity-90"
            />
            
            {/* Horizontal Scan Line */}
            <motion.div
              animate={{
                top: ["0%", "100%", "0%"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent z-20 shadow-[0_0_15px_rgba(59,130,246,0.8)] opacity-50"
            />
          </div>
        </motion.div>

        {/* Technical Progress Section */}
        <div className="flex flex-col items-center gap-8 w-80">
          <div className="flex flex-col items-center gap-2">
             <motion.p 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-blue-400 font-mono text-[11px] tracking-[0.4em] uppercase"
            >
              System Initialization
            </motion.p>
            <div className="flex items-baseline gap-2">
               <h2 className="text-white font-black text-2xl tracking-[0.1em] italic uppercase">MKAVS</h2>
               <span className="text-zinc-500 font-mono text-[10px] tracking-widest">v2.4.0_STABLE</span>
            </div>
          </div>
          
          {/* Detailed Progress Bar */}
          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative border border-white/5 backdrop-blur-sm">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: ["0%", "30%", "45%", "85%", "100%"] }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  times: [0, 0.2, 0.4, 0.8, 1]
                }}
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Auth_Protocol_Sync</span>
              <span className="text-[9px] text-blue-400/80 font-mono">LOADING...</span>
            </div>
          </div>
          
          {/* Animated Status Particles */}
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.6, 0.2],
                  backgroundColor: ["#3b82f6", "#22d3ee", "#3b82f6"]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.4 
                }}
                className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]"
              />
            ))}
          </div>
        </div>
        
        {/* Background Ambient Branding */}
        <div className="absolute -bottom-48 text-[140px] font-black text-white/[0.015] whitespace-nowrap pointer-events-none select-none italic tracking-tighter">
          MKAVS ADMIN CENTER
        </div>
      </div>
      
      {/* Corner Tech Accents */}
      <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-blue-500/20 rounded-tl-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-blue-500/20 rounded-br-3xl pointer-events-none" />
    </div>
  );
}
