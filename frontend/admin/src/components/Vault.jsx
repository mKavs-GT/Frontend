import { motion } from 'framer-motion';
import { Download, Layers as Figma, FileImage, Type, Box, Code, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Vault() {
  const [copiedSnippet, setCopiedSnippet] = useState(null);

  const copySnippet = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      
      {/* Brand Assets Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <FileImage size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Brand Assets</h2>
            <p className="text-sm font-medium text-zinc-500">Official logos, icons, and typography for MKAVS.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logo Pack */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm group">
             <div className="h-32 bg-zinc-50 dark:bg-zinc-950 rounded-[1.5rem] mb-4 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center relative overflow-hidden group-hover:border-indigo-500/30 transition-colors">
               <div className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white relative z-10">MKAVS</div>
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="font-bold text-zinc-900 dark:text-white">Master Logo Pack</h3>
                 <p className="text-xs font-semibold text-zinc-500 mt-0.5">SVG, PNG, EPS (12MB)</p>
               </div>
               <button className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition-colors">
                 <Download size={18} />
               </button>
             </div>
          </div>

          {/* Typography */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm group">
             <div className="h-32 bg-zinc-50 dark:bg-zinc-950 rounded-[1.5rem] mb-4 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center relative overflow-hidden group-hover:border-indigo-500/30 transition-colors">
               <div className="text-5xl font-serif text-zinc-900 dark:text-white relative z-10">Aa</div>
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="font-bold text-zinc-900 dark:text-white">Typography Kit</h3>
                 <p className="text-xs font-semibold text-zinc-500 mt-0.5">Inter & Playfair Display</p>
               </div>
               <button className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition-colors">
                 <Download size={18} />
               </button>
             </div>
          </div>

          {/* Figma UI Kit */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm group">
             <div className="h-32 bg-zinc-50 dark:bg-zinc-950 rounded-[1.5rem] mb-4 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center relative overflow-hidden group-hover:border-rose-500/30 transition-colors">
               <Figma size={48} className="text-rose-500 relative z-10" />
               <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="font-bold text-zinc-900 dark:text-white">Agency UI Kit</h3>
                 <p className="text-xs font-semibold text-zinc-500 mt-0.5">Components & Tokens</p>
               </div>
               <button className="px-4 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-sm">
                 Open
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Component Sandbox (Snippets) */}
      <div className="mt-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Code size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Snippet Manager</h2>
            <p className="text-sm font-medium text-zinc-500">Approved Tailwind configurations and React hooks.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col group hover:border-emerald-500/30 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-zinc-900 dark:text-white">useScrollPosition Hook</h3>
              <button 
                onClick={() => copySnippet(1, `const useScrollPosition = () => {\n  // snippet code here\n};`)}
                className="text-zinc-400 hover:text-emerald-500 transition-colors"
              >
                {copiedSnippet === 1 ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-[1.5rem] border border-zinc-200/50 dark:border-zinc-800/50 font-mono text-xs text-zinc-600 dark:text-zinc-400 overflow-x-auto flex-1">
<pre>{`import { useState, useEffect } from 'react';

export function useScrollPosition() {
  const [scrollPos, setScrollPos] = useState(0);
  
  useEffect(() => {
    const updatePosition = () => setScrollPos(window.pageYOffset);
    window.addEventListener('scroll', updatePosition);
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);
  
  return scrollPos;
}`}</pre>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col group hover:border-emerald-500/30 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-zinc-900 dark:text-white">Glassmorphism Card Tailwind</h3>
              <button 
                onClick={() => copySnippet(2, `className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm"`)}
                className="text-zinc-400 hover:text-emerald-500 transition-colors"
              >
                {copiedSnippet === 2 ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-[1.5rem] border border-zinc-200/50 dark:border-zinc-800/50 font-mono text-xs text-zinc-600 dark:text-zinc-400 overflow-x-auto flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg inline-block break-all">
                  bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 shadow-sm
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
