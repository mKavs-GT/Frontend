import { useState, useEffect } from 'react';
import { vaultService } from '../../services/vaultService';
import { X, Upload } from 'lucide-react';

export default function VaultItemForm({ item, categoryId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    categoryId: categoryId || '',
    title: '',
    subtitle: '',
    description: '',
    itemType: 'rich-content',
    openMode: 'modal',
    thumbnail: '',
    content: '',
    sortOrder: 0,
    isVisible: true,
    fileData: { fileName: '', fileUrl: '', mimeType: '', fileSize: 0, extension: '' },
    snippetData: { code: '', language: 'javascript' },
    credentialData: { label: '', username: '', password: '', apiKey: '', notes: '' },
    toolData: { url: '', ctaText: 'Open' }
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (item) {
      // If editing a credential, fetch the full item first to get the passwords
      if (item.itemType === 'credential' && !item.credentialData?.password) {
        vaultService.getAdminItem(item._id).then(fullItem => {
          setFormData(prev => ({ ...prev, ...fullItem }));
        });
      } else {
        setFormData(prev => ({ ...prev, ...item }));
      }
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await vaultService.uploadFile(file);
      setFormData(prev => ({
        ...prev,
        fileData: {
          ...prev.fileData,
          fileName: data.fileName,
          fileUrl: data.fileUrl,
          mimeType: data.mimeType,
          fileSize: data.fileSize,
          extension: data.extension
        }
      }));
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (item) {
        await vaultService.updateItem(item._id, formData);
      } else {
        await vaultService.createItem(formData);
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{item ? 'Edit Item' : 'Add Item'}</h3>
        <button onClick={onCancel} className="p-2 hover:bg-bg-muted rounded-full">
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-bg-surface border border-border-main rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Item Type</label>
            <select name="itemType" value={formData.itemType} onChange={handleChange} className="w-full bg-bg-surface border border-border-main rounded-lg px-3 py-2 text-sm">
              <option value="file">File</option>
              <option value="snippet">Snippet</option>
              <option value="credential">Credential</option>
              <option value="tool">Tool</option>
              <option value="rich-content">Rich Content</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Subtitle</label>
            <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full bg-bg-surface border border-border-main rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Thumbnail (Text/Icon)</label>
            <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="w-full bg-bg-surface border border-border-main rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        {/* Dynamic Fields based on Type */}
        <div className="p-4 bg-bg-surface border border-border-main rounded-lg">
          {formData.itemType === 'file' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm">File Upload</h4>
              <input type="file" onChange={handleFileUpload} className="text-sm" />
              {uploading && <span className="text-xs text-indigo-500">Uploading...</span>}
              {formData.fileData?.fileUrl && (
                <div className="text-xs text-emerald-500 mt-2">File ready: {formData.fileData.fileName}</div>
              )}
            </div>
          )}

          {formData.itemType === 'snippet' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm">Snippet Code</h4>
              <input type="text" placeholder="Language (e.g. javascript, html)" value={formData.snippetData?.language || ''} onChange={(e) => handleNestedChange('snippetData', 'language', e.target.value)} className="w-full bg-bg-root border border-border-main rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Paste code here..." rows={6} value={formData.snippetData?.code || ''} onChange={(e) => handleNestedChange('snippetData', 'code', e.target.value)} className="w-full bg-bg-root border border-border-main rounded-lg px-3 py-2 text-sm font-mono"></textarea>
            </div>
          )}

          {formData.itemType === 'credential' && (
            <div className="space-y-4 grid grid-cols-2 gap-4">
              <div className="col-span-2"><h4 className="font-bold text-sm">Credentials</h4></div>
              <div>
                <label className="text-xs block mb-1">Username/Email</label>
                <input type="text" value={formData.credentialData?.username || ''} onChange={(e) => handleNestedChange('credentialData', 'username', e.target.value)} className="w-full bg-bg-root border border-border-main rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs block mb-1">Password</label>
                <input type="password" value={formData.credentialData?.password || ''} onChange={(e) => handleNestedChange('credentialData', 'password', e.target.value)} className="w-full bg-bg-root border border-border-main rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-xs block mb-1">Notes</label>
                <input type="text" value={formData.credentialData?.notes || ''} onChange={(e) => handleNestedChange('credentialData', 'notes', e.target.value)} className="w-full bg-bg-root border border-border-main rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          )}

          {formData.itemType === 'tool' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm">Tool Link</h4>
              <input type="text" placeholder="URL" value={formData.toolData?.url || ''} onChange={(e) => handleNestedChange('toolData', 'url', e.target.value)} className="w-full bg-bg-root border border-border-main rounded-lg px-3 py-2 text-sm" />
              <input type="text" placeholder="CTA Text (e.g. Open)" value={formData.toolData?.ctaText || ''} onChange={(e) => handleNestedChange('toolData', 'ctaText', e.target.value)} className="w-full bg-bg-root border border-border-main rounded-lg px-3 py-2 text-sm" />
            </div>
          )}

          {(formData.itemType === 'rich-content' || formData.itemType === 'tool') && (
            <div className="space-y-4 mt-4">
              <h4 className="font-bold text-sm">Content Body</h4>
              <textarea placeholder="Description or rich text content" rows={4} value={formData.content || ''} onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))} className="w-full bg-bg-root border border-border-main rounded-lg px-3 py-2 text-sm"></textarea>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading || uploading} className="bg-text-main text-bg-surface px-6 py-2 rounded-lg font-bold disabled:opacity-50 text-sm">
            {loading ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
