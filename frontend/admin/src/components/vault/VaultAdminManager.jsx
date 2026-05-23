import { useState, useEffect } from 'react';
import { vaultService } from '../../services/vaultService';
import VaultCategoryForm from './VaultCategoryForm';
import VaultItemForm from './VaultItemForm';
import { Edit2, Trash2, Plus, ArrowLeft } from 'lucide-react';

export default function VaultAdminManager({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  
  const [showItemForm, setShowItemForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await vaultService.getAdminCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (categoryId) => {
    setItemsLoading(true);
    try {
      const data = await vaultService.getAdminItems(categoryId);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    fetchItems(cat._id);
    setShowCategoryForm(false);
    setShowItemForm(false);
  };

  const handleDeleteCategory = async (id, e) => {
    e.stopPropagation();
    if(window.confirm('Delete category and all its items?')) {
       await vaultService.deleteCategory(id);
       if(selectedCategory?._id === id) setSelectedCategory(null);
       fetchCategories();
    }
  };

  const handleDeleteItem = async (id) => {
    if(window.confirm('Delete item?')) {
       await vaultService.deleteItem(id);
       fetchItems(selectedCategory._id);
    }
  };

  return (
    <div className="bg-bg-surface rounded-2xl border border-border-main p-6 mt-6">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-main">
         <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-2 bg-bg-muted rounded-full hover:bg-text-main hover:text-bg-surface transition-colors">
             <ArrowLeft size={18} />
           </button>
           <h2 className="text-xl font-black">Vault Admin Manager</h2>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Categories Column */}
        <div className="md:col-span-1 border-r border-border-main pr-8">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Categories</h3>
              <button 
                onClick={() => { setEditCategory(null); setShowCategoryForm(true); setSelectedCategory(null); }}
                className="p-1.5 bg-bg-muted rounded hover:bg-text-main hover:text-bg-surface"
              >
                <Plus size={16} />
              </button>
           </div>
           
           {loading ? <p className="text-sm text-text-muted">Loading...</p> : (
              <div className="space-y-2">
                 {categories.map(cat => (
                    <div 
                      key={cat._id} 
                      onClick={() => handleSelectCategory(cat)}
                      className={`p-3 rounded-xl border cursor-pointer transition-colors flex justify-between items-center group
                        ${selectedCategory?._id === cat._id ? 'border-text-main bg-bg-root' : 'border-border-main bg-bg-surface hover:bg-bg-root'}`}
                    >
                       <div>
                         <p className="font-bold text-sm">{cat.title}</p>
                         <p className="text-[10px] text-text-muted">Order: {cat.sortOrder}</p>
                       </div>
                       <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setEditCategory(cat); setShowCategoryForm(true); setSelectedCategory(null); }} className="text-text-muted hover:text-text-main"><Edit2 size={14}/></button>
                          <button onClick={(e) => handleDeleteCategory(cat._id, e)} className="text-rose-500 hover:text-rose-600"><Trash2 size={14}/></button>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>

        {/* Form / Items Column */}
        <div className="md:col-span-2">
           {showCategoryForm && (
              <VaultCategoryForm 
                 category={editCategory} 
                 onSuccess={() => { setShowCategoryForm(false); fetchCategories(); }}
                 onCancel={() => setShowCategoryForm(false)}
              />
           )}

           {!showCategoryForm && !selectedCategory && (
              <div className="h-full flex items-center justify-center text-text-muted text-sm border-2 border-dashed border-border-main rounded-xl">
                 Select a category to view items or create a new one.
              </div>
           )}

           {!showCategoryForm && selectedCategory && (
              <div>
                 <div className="flex justify-between items-center mb-6 bg-bg-root p-4 rounded-xl border border-border-main">
                    <div>
                      <h3 className="font-bold text-lg">{selectedCategory.title} Items</h3>
                      <p className="text-xs text-text-muted">{items.length} items found</p>
                    </div>
                    <button 
                      onClick={() => { setEditItem(null); setShowItemForm(true); }}
                      className="px-4 py-2 bg-text-main text-bg-surface rounded-lg font-bold text-xs flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                 </div>

                 {showItemForm && (
                    <VaultItemForm
                       item={editItem}
                       categoryId={selectedCategory._id}
                       onSuccess={() => { setShowItemForm(false); fetchItems(selectedCategory._id); }}
                       onCancel={() => setShowItemForm(false)}
                    />
                 )}

                 {!showItemForm && itemsLoading ? <p>Loading items...</p> : null}
                 
                 {!showItemForm && !itemsLoading && (
                    <div className="space-y-3">
                       {items.map(item => (
                          <div key={item._id} className="p-4 bg-bg-surface border border-border-main rounded-xl flex justify-between items-center">
                             <div>
                                <span className="text-[9px] uppercase tracking-widest font-bold bg-bg-muted px-2 py-0.5 rounded text-text-muted mb-1 inline-block">{item.itemType}</span>
                                <p className="font-bold text-sm">{item.title}</p>
                                {item.subtitle && <p className="text-xs text-text-muted">{item.subtitle}</p>}
                             </div>
                             <div className="flex gap-3">
                               <button onClick={() => { setEditItem(item); setShowItemForm(true); }} className="p-2 bg-bg-muted rounded hover:bg-text-main hover:text-bg-surface transition-colors"><Edit2 size={16}/></button>
                               <button onClick={() => handleDeleteItem(item._id)} className="p-2 bg-rose-50 text-rose-500 rounded hover:bg-rose-500 hover:text-white transition-colors"><Trash2 size={16}/></button>
                             </div>
                          </div>
                       ))}
                       {items.length === 0 && (
                          <div className="p-8 text-center text-text-muted text-sm border border-dashed border-border-main rounded-xl">No items in this category.</div>
                       )}
                    </div>
                 )}
              </div>
           )}
        </div>

      </div>
    </div>
  );
}
