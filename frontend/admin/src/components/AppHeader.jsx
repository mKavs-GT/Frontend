import React from 'react';
import { Menu, Search, Sun, Moon, Bell } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

export default function AppHeader({ 
  user, 
  activeView, 
  getViewTitle, 
  isDarkMode, 
  setIsDarkMode, 
  setIsMobileMenuOpen,
  setIsCommandPaletteOpen
}) {
  return (
    <header className="h-14 bg-bg-surface border-b border-border-main flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="lg:hidden p-2 hover:bg-bg-muted rounded-lg text-text-muted transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-text-main font-black uppercase tracking-tighter hidden sm:inline">MKAVS-GT</span>
          <span className="text-border-main mx-1 hidden sm:inline">/</span>
          <span className="text-text-muted">{getViewTitle(activeView)}</span>
        </div>
        
        {/* Search Bar - Hidden on small mobile */}
        <div 
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center max-w-xs w-full ml-6 relative cursor-pointer group"
        >
          <Search size={14} className="absolute left-3 text-text-muted group-hover:text-text-main transition-colors" />
          <div className="w-full bg-bg-muted border border-transparent group-hover:border-border-main group-hover:bg-bg-surface rounded-lg py-1.5 pl-9 pr-3 text-sm transition-all text-text-muted">
            Search...
          </div>
          <div className="absolute right-2 flex items-center gap-1 opacity-60">
            <span className="text-[10px] font-bold text-text-muted bg-bg-surface border border-border-main px-1 rounded">⌘</span>
            <span className="text-[10px] font-bold text-text-muted bg-bg-surface border border-border-main px-1 rounded">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
         {/* Theme Toggle */}
         <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border-main hover:bg-bg-muted transition-colors text-text-muted hover:text-text-main"
            title="Toggle Theme"
         >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
         </button>

         <NotificationCenter user={user} />

         {/* User Profile */}
         <div className="w-9 h-9 rounded-lg border border-border-main overflow-hidden shadow-sm bg-bg-muted cursor-pointer hover:border-text-muted transition-colors">
           <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
            alt={user.name} 
            className="w-full h-full object-cover" 
          />
         </div>
      </div>
    </header>
  );
}
