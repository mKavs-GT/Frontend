import { useState, useEffect, useRef } from 'react';
import { vaultService } from '../../services/vaultService';
import { X, Plus, File, Trash2, UploadCloud } from 'lucide-react';

export default function VaultItemForm({ item, categoryId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    categoryId: categoryId || '',
    title: '',
    itemType: 'file', // Default to file for this simplified form
    openMode: 'modal',
    files: []
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (item) {
      setFormData(prev => ({ 
        ...prev, 
        title: item.title,
        itemType: 'file',
        files: item.files || (item.fileData && item.fileData.fileUrl ? [item.fileData] : [])
      }));
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const filesToUpload = Array.from(e.target.files);
    if (filesToUpload.length === 0) return;
    
    setUploading(true);
    try {
      const uploadedFiles = [];
      for (const file of filesToUpload) {
        const data = await vaultService.uploadFile(file);
        uploadedFiles.push({
          fileName: data.fileName,
          fileUrl: data.fileUrl,
          mimeType: data.mimeType,
          fileSize: data.fileSize,
          extension: data.extension
        });
      }
      
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...uploadedFiles]
      }));
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    setFormData(prev => {
      const newFiles = [...prev.files];
      newFiles.splice(index, 1);
      return { ...prev, files: newFiles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.files.length === 0) {
      alert('Please upload at least one file.');
      return;
    }
    
    setLoading(true);
    
    // For backwards compatibility, populate fileData with the first file
    const submissionData = { ...formData };
    if (submissionData.files.length > 0) {
      submissionData.fileData = submissionData.files[0];
    }
    
    try {
      if (item) {
        await vaultService.updateItem(item._id, submissionData);
      } else {
        await vaultService.createItem(submissionData);
      }
      onSuccess();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-root p-6 rounded-xl border border-border-main mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">{item ? 'Edit Item' : 'Add Item'}</h3>
        <button onClick={onCancel} className="p-2 hover:bg-bg-muted rounded-full">
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Title</label>
          <input 
            required 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="e.g. Master Logo Pack"
            className="w-full bg-bg-surface border border-border-main rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors" 
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Upload Files</label>
          
          <div 
            className="border-2 border-dashed border-border-main rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-bg-surface transition-colors mb-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              multiple 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin mb-3"></div>
                <p className="text-sm font-bold text-indigo-500">Uploading...</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-bg-muted rounded-full flex items-center justify-center text-text-muted mb-3 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  <Plus size={24} />
                </div>
                <p className="text-sm font-bold">Click to browse files</p>
                <p className="text-xs text-text-muted mt-1">Upload documents, images, or archives</p>
              </>
            )}
          </div>

          {formData.files.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Attached Files ({formData.files.length})</p>
              {formData.files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-bg-surface border border-border-main rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <File size={16} className="text-indigo-500 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{file.fileName}</span>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      ({(file.fileSize / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }} 
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={loading || uploading} 
            className="bg-text-main text-bg-surface px-8 py-3 rounded-xl font-bold disabled:opacity-50 text-sm hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all"
          >
            {loading ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
