import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import VaultItemCard from './VaultItemCard';

export default function VaultCategorySection({ category, onOpenModal }) {
  const IconComponent = Icons[category.icon] || Icons.Folder;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-bg-muted flex items-center justify-center text-brand-purple dark:text-purple-400">
          <IconComponent size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-text-main">{category.title}</h2>
          {category.description && (
             <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-0.5">{category.description}</p>
          )}
        </div>
      </div>

      <div className={`grid gap-6 ${category.layoutType === 'cards' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {category.items?.map((item) => (
          <VaultItemCard key={item._id} item={item} onOpenModal={onOpenModal} />
        ))}
        {(!category.items || category.items.length === 0) && (
          <div className="col-span-full py-8 text-center text-text-muted text-sm border border-dashed border-border-main rounded-xl bg-bg-surface/50">
            No items in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
