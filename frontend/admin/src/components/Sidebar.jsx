import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Kanban, 
  Clock, 
  Users, 
  Database, 
  Shield, 
  LogOut, 
  Ticket as TicketIcon, 
  TrendingUp, 
  Info, 
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const kaironIcon = '/kairon-icon.png';

const NavItem = ({ icon, label, active, onClick, collapsed, badge }) => (
  <button 
    onClick={onClick}
    className={`group relative flex items-center gap-3 w-full p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active 
        ? 'bg-bg-muted text-text-main border border-border-main shadow-sm' 
        : 'text-text-muted hover:bg-bg-muted border border-transparent'
    }`}
  >
    <div className={`flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'text-text-main' : 'text-text-muted group-hover:text-text-main'}`}>
      {icon}
    </div>
    
    {!collapsed && (
      <motion.span 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="truncate flex-1 text-left"
      >
        {label}
      </motion.span>
    )}

    {badge && !collapsed && (
      <span className="px-1.5 py-0.5 rounded-full bg-accent text-bg-root text-[10px] font-bold">
        {badge}
      </span>
    )}

    {collapsed && (
      <div className="absolute left-full ml-3 px-2 py-1 bg-text-main text-bg-surface text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    )}
  </button>
);

const NavSection = ({ title, children, collapsed }) => (
  <div className="space-y-1">
    {!collapsed && (
      <p className="px-3 mb-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
        {title}
      </p>
    )}
    <div className="space-y-0.5">
      {children}
    </div>
  </div>
);

export default function Sidebar({ 
  user, 
  activeView, 
  setActiveView, 
  isDarkMode, 
  isLiveOnChatbot, 
  handleLogout,
  isOpen, // Mobile drawer state
  setIsOpen,
  isCollapsed, // Desktop/Tablet collapsed state
  setIsCollapsed
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  // State for pinned (layout) width vs visual (hover) width
  const visualCollapsed = isCollapsed && !isHovered;
  
  const layoutWidth = isCollapsed ? '64px' : '240px';
  const visualWidth = visualCollapsed ? '64px' : '240px';

  return (
    <>
      {/* Layout Placeholder: This keeps the dashboard content stable */}
      <div 
        className="hidden md:block flex-shrink-0 transition-all duration-300" 
        style={{ width: layoutWidth }} 
      />
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ 
          width: visualWidth,
          x: isOpen ? 0 : (window.innerWidth < 768 ? '-100%' : 0)
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        className={`fixed top-0 left-0 bottom-0 flex-shrink-0 bg-bg-surface border-r border-border-main flex flex-col z-[70] h-screen h-[100dvh] overflow-hidden transition-shadow duration-300 ${
          isHovered && isCollapsed ? 'shadow-2xl ring-1 ring-black/5' : ''
        }`}
      >
        {/* Workspace Switcher / Logo */}
        <div className="p-4 border-b border-border-main flex items-center justify-between min-h-[64px] relative group/header">
          <div className={`flex items-center transition-all duration-300 ${visualCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
            <img 
              src="/LOGOI.png" 
              className={`${visualCollapsed ? 'w-10 h-10' : 'w-8 h-8'} rounded-md object-contain transition-all`} 
              alt="Logo" 
            />
            {!visualCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <img src="/MKAVS.png" className={`h-4 object-contain ${isDarkMode ? 'invert' : ''}`} alt="MKAVS" />
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-tight">Enterprise</p>
              </motion.div>
            )}
          </div>
          
          {/* Collapse Toggle for Desktop */}
          {!isOpen && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden lg:flex p-1 rounded-md hover:bg-bg-muted text-text-muted hover:text-text-main transition-all border border-transparent hover:border-border-main ${visualCollapsed ? 'absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/header:opacity-100' : ''}`}
            >
              {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={16} />}
            </button>
          )}

          {/* Close button for Mobile */}
          {isOpen && (
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-bg-muted text-text-muted"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-8 no-scrollbar scroll-smooth">
          <NavSection title="Dashboard" collapsed={visualCollapsed}>
            <NavItem 
              icon={<TrendingUp size={20} />} 
              label="Overview" 
              active={activeView === 'analytics'} 
              onClick={() => { setActiveView('analytics'); setIsOpen(false); }} 
              collapsed={visualCollapsed}
            />
            <NavItem 
              icon={<Kanban size={20} />} 
              label="Sprint Plan" 
              active={activeView === 'project'} 
              onClick={() => { setActiveView('project'); setIsOpen(false); }} 
              collapsed={visualCollapsed}
            />
            <NavItem 
              icon={<TicketIcon size={20} />} 
              label="Approval Tickets" 
              active={activeView === 'tickets'} 
              onClick={() => { setActiveView('tickets'); setIsOpen(false); }} 
              collapsed={visualCollapsed}
            />
          </NavSection>

          <NavSection title="Monitor" collapsed={visualCollapsed}>
            <NavItem 
              icon={<Clock size={20} />} 
              label="Time Tracker" 
              active={activeView === 'time'} 
              onClick={() => { setActiveView('time'); setIsOpen(false); }} 
              collapsed={visualCollapsed}
            />
            <NavItem 
              icon={<Users size={20} />} 
              label="Team Tracker" 
              active={activeView === 'team'} 
              onClick={() => { setActiveView('team'); setIsOpen(false); }} 
              collapsed={visualCollapsed}
            />
            <NavItem 
              icon={<Info size={20} />} 
              label="Logs" 
              active={activeView === 'logs'} 
              onClick={() => { setActiveView('logs'); setIsOpen(false); }} 
              collapsed={visualCollapsed}
            />
          </NavSection>

          <NavSection title="Manage" collapsed={visualCollapsed}>
            <NavItem 
              icon={<Database size={20} />} 
              label="Client Hub (CRM)" 
              active={activeView === 'crm'} 
              onClick={() => { setActiveView('crm'); setIsOpen(false); }} 
              collapsed={visualCollapsed}
            />
            <NavItem 
              icon={<Briefcase size={20} />} 
              label="The Vault" 
              active={activeView === 'vault'} 
              onClick={() => { setActiveView('vault'); setIsOpen(false); }} 
              collapsed={visualCollapsed}
            />
            <NavItem 
              icon={
                <div className="relative">
                  <img src={kaironIcon} alt="" className="w-5 h-5" />
                  {isLiveOnChatbot && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border-2 border-bg-surface"></div>
                  )}
                </div>
              } 
              label="Kairon Live Bot" 
              active={activeView === 'kairon'} 
              onClick={() => { setActiveView('kairon'); setIsOpen(false); }} 
              collapsed={visualCollapsed}
            />
            {user?.isExecutive && (
              <NavItem 
                icon={<Shield size={20} className="text-rose-600" />} 
                label="God Mode" 
                active={activeView === 'godmode'} 
                onClick={() => { setActiveView('godmode'); setIsOpen(false); }} 
                collapsed={visualCollapsed}
              />
            )}
          </NavSection>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border-main">
          <NavItem 
            icon={<LogOut size={20} className="text-rose-600" />} 
            label="Logout" 
            onClick={handleLogout} 
            collapsed={visualCollapsed}
          />
        </div>
      </motion.aside>
    </>
  );
}
