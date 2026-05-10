import { motion } from 'framer-motion';
import { Download, Layers as Figma, FileImage, Type, Box, Code, Copy, CheckCircle, Pipette, ExternalLink, Wifi } from 'lucide-react';
import { useState } from 'react';

export default function Vault() {
  const [copiedSnippet, setCopiedSnippet] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#4a154b');
  const [speedTestRunning, setSpeedTestRunning] = useState(false);
  const [speedResult, setSpeedResult] = useState(null);

  const runSpeedTest = () => {
    setSpeedTestRunning(true);
    setSpeedResult(null);
    setTimeout(() => {
      setSpeedTestRunning(false);
      setSpeedResult(128.4);
    }, 2000);
  };

  const copySnippet = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Brand Assets Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-[#4a154b]">
            <FileImage size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Brand Assets</h2>
            <p className="text-xs font-bold text-[#6a737d] uppercase tracking-widest mt-0.5">Approved logos and iconography</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Master Logo Pack', meta: 'SVG, PNG, EPS (12MB)', icon: <div className="text-2xl font-black tracking-tighter">MKAVS</div>, color: 'indigo' },
            { title: 'Typography Kit', meta: 'Inter & Playfair Display', icon: <div className="text-4xl font-serif">Aa</div>, color: 'purple' },
            { title: 'Agency UI Kit', meta: 'Components & Tokens', icon: <Figma size={40} className="text-[#f24e1e]" />, isExternal: true }
          ].map((asset, i) => (
            <div key={i} className="bg-white border border-[#e1e4e8] rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
               <div className="h-32 bg-[#f9f9fb] rounded-lg mb-4 border border-[#e1e4e8] flex items-center justify-center relative overflow-hidden">
                 {asset.icon}
                 <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="text-sm font-black tracking-tight">{asset.title}</h3>
                   <p className="text-[10px] font-bold text-[#6a737d] uppercase tracking-widest mt-1">{asset.meta}</p>
                 </div>
                 {asset.isExternal ? (
                   <button className="px-4 py-2 rounded-lg bg-[#1a1a1b] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                     Open Kit
                   </button>
                 ) : (
                   <button className="p-2.5 rounded-lg bg-[#f3f4f6] text-[#1a1a1b] hover:bg-[#1a1a1b] hover:text-white transition-all">
                     <Download size={16} />
                   </button>
                 )}
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Component Sandbox (Snippets) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-[#4a154b]">
            <Code size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Snippet Manager</h2>
            <p className="text-xs font-bold text-[#6a737d] uppercase tracking-widest mt-0.5">Approved hooks and utilities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { 
              id: 1, 
              title: 'useScrollPosition Hook', 
              code: `import { useState, useEffect } from 'react';\n\nexport function useScrollPosition() {\n  const [scrollPos, setScrollPos] = useState(0);\n  useEffect(() => {\n    const update = () => setScrollPos(window.pageYOffset);\n    window.addEventListener('scroll', update);\n    return () => window.removeEventListener('scroll', update);\n  }, []);\n  return scrollPos;\n}` 
            },
            { 
              id: 2, 
              title: 'Modern Card Styling', 
              code: `className="bg-white border border-[#e1e4e8] rounded-xl p-8 shadow-sm hover:shadow-md transition-all"` 
            }
          ].map((snippet) => (
            <div key={snippet.id} className="bg-white border border-[#e1e4e8] rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black tracking-tight">{snippet.title}</h3>
                <button 
                  onClick={() => copySnippet(snippet.id, snippet.code)}
                  className="p-1.5 hover:bg-[#f3f4f6] rounded transition-colors"
                >
                  {copiedSnippet === snippet.id ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} className="text-[#6a737d]" />}
                </button>
              </div>
              <div className="bg-[#f9f9fb] p-4 rounded-lg border border-[#e1e4e8] font-mono text-[11px] text-[#4a5568] overflow-x-auto">
                <pre>{snippet.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dev Kit */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-[#4a154b]">
            <Pipette size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Tools</h2>
            <p className="text-xs font-bold text-[#6a737d] uppercase tracking-widest mt-0.5">Dashboard Utilities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e1e4e8] rounded-xl p-8 shadow-sm flex items-center gap-8">
            <input 
              type="color" 
              value={selectedColor} 
              onChange={(e) => setSelectedColor(e.target.value)} 
              className="w-16 h-16 rounded-xl cursor-pointer border-4 border-[#f3f4f6] p-0 bg-transparent block shrink-0" 
            />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-[#6a737d] uppercase tracking-widest mb-1">Theme Primary</p>
              <div className="flex items-center justify-between bg-[#f9f9fb] px-4 py-2 rounded-lg border border-[#e1e4e8]">
                <p className="font-mono font-bold text-sm">{selectedColor.toUpperCase()}</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(selectedColor)} 
                  className="text-[#6a737d] hover:text-[#1a1a1b]"
                >
                  <Copy size={14}/>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e1e4e8] rounded-xl p-8 shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Wifi size={16} /> Network Speed
              </p>
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                <div className={`w-2 h-2 rounded-full ${speedTestRunning ? 'bg-indigo-500 animate-ping' : 'bg-indigo-500'}`}></div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center flex-1 py-4 relative">
              {speedTestRunning ? (
                <div className="flex flex-col items-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-16 h-16 border-[4px] border-zinc-100 border-t-indigo-500 rounded-full mb-4"
                  />
                  <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest animate-pulse">Testing...</p>
                </div>
              ) : (
                <div className="text-center">
                  {speedResult ? (
                    <>
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-end justify-center gap-2">
                        <p className="text-5xl font-black text-zinc-900 tracking-tighter leading-none">{speedResult}</p>
                        <p className="text-lg font-bold text-zinc-400 uppercase tracking-widest mb-1">Mbps</p>
                      </motion.div>
                      <p className="text-xs font-semibold text-emerald-500 mt-3 bg-emerald-50 inline-flex px-3 py-1 rounded-lg">Connection is stable</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-zinc-400">
                      <Wifi size={40} className="mb-2 opacity-50" />
                      <p className="text-sm font-semibold uppercase tracking-widest">Ready to test</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={runSpeedTest}
              disabled={speedTestRunning}
              className="w-full py-3 rounded-xl bg-zinc-900 text-white font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-4 active:scale-[0.98] text-xs uppercase tracking-widest"
            >
              Run Speed Test
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
