import { useState } from 'react';
import { Download, ExternalLink, Code, CheckCircle, Copy, Key } from 'lucide-react';
import { API_BASE_URL } from '../../config';

export default function VaultItemCard({ item, onOpenModal }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClick = () => {
    if (item.openMode === 'modal') {
      onOpenModal(item);
    } else if (item.openMode === 'new-tab') {
      if (item.itemType === 'tool' && item.toolData?.url) {
         window.open(item.toolData.url, '_blank');
      }
    }
  };

  if (item.itemType === 'file') {
    return (
      <div onClick={handleClick} className="bg-bg-surface border border-border-main rounded-xl p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer">
         <div className="h-32 bg-bg-root rounded-lg mb-4 border border-border-main flex items-center justify-center relative overflow-hidden">
           {item.thumbnail ? (
             <div className="text-2xl font-black tracking-tighter">{item.thumbnail}</div>
           ) : (
             <div className="text-text-muted">No Preview</div>
           )}
           <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         </div>
         <div className="flex items-center justify-between">
           <div>
             <h3 className="text-sm font-black tracking-tight text-text-main">{item.title}</h3>
             <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{item.subtitle || item.fileData?.extension}</p>
           </div>
           <button 
             onClick={(e) => {
               e.stopPropagation();
               if(item.fileData?.fileUrl) {
                 window.open(`${API_BASE_URL}${item.fileData.fileUrl}`, '_blank');
               }
             }}
             className="p-2.5 rounded-lg bg-bg-muted text-text-main hover:bg-text-main hover:text-bg-surface transition-all"
           >
             <Download size={16} />
           </button>
         </div>
      </div>
    );
  }

  if (item.itemType === 'snippet') {
    return (
      <div onClick={handleClick} className="bg-bg-surface border border-border-main rounded-xl p-6 shadow-sm flex flex-col transition-all cursor-pointer hover:shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black tracking-tight text-text-main">{item.title}</h3>
          <button 
            onClick={(e) => handleCopy(e, item.snippetData?.code)}
            className="p-1.5 hover:bg-bg-muted rounded transition-colors"
          >
            {copied ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} className="text-text-muted" />}
          </button>
        </div>
        <div className="bg-bg-root p-4 rounded-lg border border-border-main font-mono text-[11px] text-text-muted overflow-x-auto max-h-32">
          <pre>{item.snippetData?.code}</pre>
        </div>
      </div>
    );
  }

  if (item.itemType === 'tool') {
     return (
        <div onClick={handleClick} className="bg-bg-surface border border-border-main rounded-xl p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer">
           <div className="h-32 bg-bg-root rounded-lg mb-4 border border-border-main flex items-center justify-center relative overflow-hidden">
              <div className="text-2xl font-black tracking-tighter">{item.thumbnail || 'Tool'}</div>
           </div>
           <div className="flex items-center justify-between">
             <div>
               <h3 className="text-sm font-black tracking-tight text-text-main">{item.title}</h3>
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{item.subtitle}</p>
             </div>
             <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if(item.toolData?.url) window.open(item.toolData.url, '_blank');
                }}
                className="px-4 py-2 rounded-lg bg-text-main text-bg-surface font-bold text-[10px] uppercase tracking-widest hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all"
             >
               {item.toolData?.ctaText || 'Open'}
             </button>
           </div>
        </div>
     );
  }

  if (item.itemType === 'credential') {
     return (
        <div onClick={handleClick} className="bg-bg-surface border border-border-main rounded-xl p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center">
                <Key size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight text-text-main">{item.title}</h3>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Protected Credential</p>
              </div>
            </div>
            <div>
               <button className="text-xs bg-bg-muted px-3 py-1.5 rounded-lg font-semibold hover:bg-text-main hover:text-bg-surface transition-all">View</button>
            </div>
        </div>
     );
  }

  // Fallback for rich-content or generic
  return (
    <div onClick={handleClick} className="bg-bg-surface border border-border-main rounded-xl p-8 shadow-sm flex items-center gap-4 transition-all cursor-pointer hover:shadow-md hover:border-indigo-500/30">
      <div className="flex-1">
         <h3 className="text-sm font-black text-text-main mb-1">{item.title}</h3>
         {item.subtitle && <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">{item.subtitle}</p>}
         <p className="text-sm text-text-muted line-clamp-2">{item.content}</p>
      </div>
    </div>
  );
}
