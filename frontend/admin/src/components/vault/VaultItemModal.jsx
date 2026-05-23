import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle, Download, ExternalLink, Key, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { vaultService } from '../../services/vaultService';
import { API_BASE_URL } from '../../config';

export default function VaultItemModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fullItem, setFullItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If it's a credential, we might need to fetch the unmasked details
    if (item?.itemType === 'credential') {
      setLoading(true);
      vaultService.getAdminItem(item._id)
        .then(data => setFullItem(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setFullItem(item);
    }
  }, [item]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!item) return null;

  const dataToUse = fullItem || item;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-bg-surface w-full max-w-2xl rounded-2xl shadow-2xl border border-border-main overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-main">
            <div>
              <h2 className="text-xl font-black text-text-main">{dataToUse.title}</h2>
              {dataToUse.subtitle && <p className="text-sm text-text-muted mt-1">{dataToUse.subtitle}</p>}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-bg-muted rounded-full transition-colors">
              <X size={20} className="text-text-muted" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            {loading ? (
               <div className="flex justify-center items-center py-12">
                 <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"></div>
               </div>
            ) : (
               <>
                 {/* Snippet Viewer */}
                 {dataToUse.itemType === 'snippet' && (
                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                       <span className="text-xs font-bold uppercase tracking-widest text-text-muted">{dataToUse.snippetData?.language || 'Code'}</span>
                       <button onClick={() => handleCopy(dataToUse.snippetData?.code)} className="flex items-center gap-2 text-xs font-bold text-text-main bg-bg-muted px-3 py-1.5 rounded hover:bg-text-main hover:text-bg-surface transition-colors">
                         {copied ? <CheckCircle size={14} className="text-emerald-500"/> : <Copy size={14} />}
                         {copied ? 'Copied' : 'Copy Code'}
                       </button>
                     </div>
                     <pre className="bg-bg-root p-4 rounded-xl border border-border-main font-mono text-sm overflow-x-auto text-text-muted whitespace-pre-wrap">
                       {dataToUse.snippetData?.code}
                     </pre>
                   </div>
                 )}

                 {/* Credential Viewer */}
                 {dataToUse.itemType === 'credential' && (
                   <div className="space-y-6">
                     <div className="flex items-center gap-4 p-4 bg-rose-50 dark:bg-rose-500/10 rounded-xl text-rose-600 dark:text-rose-400">
                       <Key size={24} />
                       <div>
                         <p className="font-bold">Highly Sensitive Data</p>
                         <p className="text-xs mt-1">Do not share these credentials outside the team.</p>
                       </div>
                     </div>

                     <div className="space-y-4">
                       {dataToUse.credentialData?.username && (
                         <div>
                           <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Username / Email</label>
                           <div className="flex bg-bg-root border border-border-main rounded-lg overflow-hidden">
                             <input type="text" readOnly value={dataToUse.credentialData.username} className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-text-main" />
                             <button onClick={() => handleCopy(dataToUse.credentialData.username)} className="px-4 border-l border-border-main hover:bg-bg-muted text-text-muted"><Copy size={14}/></button>
                           </div>
                         </div>
                       )}

                       {dataToUse.credentialData?.password && (
                         <div>
                           <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Password</label>
                           <div className="flex bg-bg-root border border-border-main rounded-lg overflow-hidden">
                             <input type={showPassword ? "text" : "password"} readOnly value={dataToUse.credentialData.password} className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-text-main font-mono" />
                             <button onClick={() => setShowPassword(!showPassword)} className="px-4 border-l border-border-main hover:bg-bg-muted text-text-muted">
                               {showPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                             </button>
                             <button onClick={() => handleCopy(dataToUse.credentialData.password)} className="px-4 border-l border-border-main hover:bg-bg-muted text-text-muted"><Copy size={14}/></button>
                           </div>
                         </div>
                       )}
                       
                       {dataToUse.credentialData?.notes && (
                         <div className="pt-4 mt-4 border-t border-border-main">
                           <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Notes</label>
                           <p className="text-sm text-text-muted">{dataToUse.credentialData.notes}</p>
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                 {/* Generic / Rich Content */}
                 {dataToUse.itemType !== 'snippet' && dataToUse.itemType !== 'credential' && (
                    <div className="space-y-4">
                      {dataToUse.content && (
                         <div className="text-text-main whitespace-pre-wrap">{dataToUse.content}</div>
                      )}
                      {dataToUse.itemType === 'file' && dataToUse.fileData && (
                         <div className="p-4 bg-bg-root border border-border-main rounded-xl mt-4">
                           <p className="font-bold text-sm mb-2">File Details</p>
                           <ul className="text-xs text-text-muted space-y-1">
                             <li>Name: {dataToUse.fileData.fileName}</li>
                             <li>Size: {(dataToUse.fileData.fileSize / 1024).toFixed(2)} KB</li>
                             <li>Type: {dataToUse.fileData.mimeType}</li>
                           </ul>
                         </div>
                      )}
                    </div>
                 )}
               </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border-main bg-bg-root flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors">
               Close
             </button>
             {dataToUse.itemType === 'file' && dataToUse.fileData?.fileUrl && (
               <a 
                 href={`${API_BASE_URL}${dataToUse.fileData.fileUrl}`} 
                 download 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center gap-2 px-4 py-2 bg-text-main text-bg-surface text-sm font-bold rounded-lg hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all"
               >
                 <Download size={16} />
                 Download
               </a>
             )}
             {dataToUse.itemType === 'tool' && dataToUse.toolData?.url && (
               <a 
                 href={dataToUse.toolData.url} 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center gap-2 px-4 py-2 bg-text-main text-bg-surface text-sm font-bold rounded-lg hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all"
               >
                 <ExternalLink size={16} />
                 Open Link
               </a>
             )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
