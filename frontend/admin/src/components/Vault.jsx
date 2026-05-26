import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { vaultService } from '../services/vaultService';
import VaultCategorySection from './vault/VaultCategorySection';
import VaultItemModal from './vault/VaultItemModal';
import VaultAdminManager from './vault/VaultAdminManager';
import { Settings } from 'lucide-react';

export default function Vault() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Use localStorage to check if user is executive to show admin button
  const user = JSON.parse(localStorage.getItem('mkavs_admin_user') || '{}');
  const isAdmin = user.isExecutive === true || user.role === 'admin';

  useEffect(() => {
    if (!showAdmin) {
      fetchData();
    }
  }, [showAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await vaultService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load Vault data.');
    } finally {
      setLoading(false);
    }
  };

  if (showAdmin) {
    return <VaultAdminManager onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="space-y-10 pb-20 transition-colors relative">
      {isAdmin && (
        <div className="absolute top-0 right-0 z-10">
          <button 
            onClick={() => setShowAdmin(true)}
            className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-main rounded-xl shadow-sm text-xs font-bold uppercase tracking-widest hover:border-text-main transition-colors"
          >
            <Settings size={14} /> Manage Vault
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-rose-50 text-rose-600 p-6 rounded-xl border border-rose-200">
          {error}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <p className="text-lg font-bold">Vault is Empty</p>
          <p className="text-sm mt-2">No active categories found. Add some from the admin manager.</p>
        </div>
      ) : (
        categories.map(category => (
          <VaultCategorySection 
            key={category._id} 
            category={category} 
            onOpenModal={(item) => setSelectedItem(item)} 
          />
        ))
      )}

      {selectedItem && (
        <VaultItemModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}
