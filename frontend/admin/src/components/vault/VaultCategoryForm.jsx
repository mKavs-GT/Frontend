import { useState, useEffect } from 'react';
import { vaultService } from '../../services/vaultService';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';

export default function VaultCategoryForm({ category, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    icon: 'Folder',
    sortOrder: 0,
    isActive: true,
    layoutType: 'grid'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        title: category.title,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || 'Folder',
        sortOrder: category.sortOrder || 0,
        isActive: category.isActive !== false,
        layoutType: category.layoutType || 'grid'
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (category) {
        await vaultService.updateCategory(category._id, formData);
      } else {
        await vaultService.createCategory(formData);
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
        <h3 className="text-lg font-bold">{category ? 'Edit Category' : 'Add Category'}</h3>
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
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Slug</label>
            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-bg-surface border border-border-main rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full bg-bg-surface border border-border-main rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Icon (Lucide Name)</label>
            <input type="text" name="icon" value={formData.icon} onChange={handleChange} className="w-full bg-bg-surface border border-border-main rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Layout Type</label>
            <select name="layoutType" value={formData.layoutType} onChange={handleChange} className="w-full bg-bg-surface border border-border-main rounded-lg px-3 py-2 text-sm">
              <option value="grid">Grid (3 cols)</option>
              <option value="cards">Cards (2 cols)</option>
              <option value="list">List</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Sort Order</label>
            <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} className="w-full bg-bg-surface border border-border-main rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
              Is Active
            </label>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="bg-text-main text-bg-surface px-6 py-2 rounded-lg font-bold disabled:opacity-50 text-sm">
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
