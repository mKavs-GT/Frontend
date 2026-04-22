"use client";
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  Zap,
  Layout,
  Settings
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface AdminAgent {
  email: string;
  name: string;
  role: string;
  alias?: string;
  employeeId?: string;
}

interface SidebarProps {
  className?: string;
  onNavigate?: (itemId: string) => void;
  activeItem?: string;
  onLogout?: () => void;
  adminAgent?: AdminAgent | null;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Home },
  { id: "users", name: "Users", icon: Users },
  { id: "consultations", name: "Consultations", icon: MessageSquare },
  { id: "schedule", name: "Schedule", icon: Calendar },
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "sprint", name: "Sprint", icon: Zap, badge: "PRO" },
  { id: "profile", name: "Profile", icon: User },
];

export function Sidebar({ className = "", onNavigate, activeItem: externalActiveItem, onLogout, adminAgent }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalActiveItem, setInternalActiveItem] = useState("dashboard");
  
  const activeItem = externalActiveItem !== undefined ? externalActiveItem : internalActiveItem;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(true);
      else setIsOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = (itemId: string) => {
    setInternalActiveItem(itemId);
    if (onNavigate) onNavigate(itemId);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 p-2 rounded-xl bg-white dark:bg-zinc-900 shadow-lg md:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-zinc-950 dark:bg-black transition-all duration-500 ease-in-out select-none shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-[100px]" : "w-[280px]",
          "md:static md:translate-x-0",
          className
        )}
      >
        <div className="h-[100px] flex items-center px-8 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_hsla(var(--primary),0.5)]">
                <Layout className="w-6 h-6 text-primary-foreground" strokeWidth={3} />
             </div>
             {!isCollapsed && (
               <div className="flex flex-col">
                 <span className="text-[20px] font-black text-white tracking-tighter leading-none italic uppercase">Jobie<span className="text-primary">.</span></span>
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">Admin v2.0</span>
               </div>
             )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <div key={item.id} className="relative group px-2">
                {isActive && !isCollapsed && (
                  <div className="absolute inset-y-0 right-[-16px] w-[280px] bg-background rounded-l-[40px] shadow-sm z-0">
                    <div className="sidebar-curve-top" />
                    <div className="sidebar-curve-bottom" />
                  </div>
                )}

                <button
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    "relative z-10 flex items-center w-full transition-all duration-300 rounded-[18px]",
                    isCollapsed ? "justify-center h-[54px]" : "px-6 h-[54px] gap-4",
                    isActive 
                      ? "text-primary dark:text-primary font-black" 
                      : "text-zinc-500 hover:text-white"
                  )}
                >
                  <Icon className={cn(
                    "w-6 h-6 shrink-0 transition-transform duration-300",
                    isActive ? "scale-110 neon-text" : "group-hover:scale-110"
                  )} />
                  
                  {!isCollapsed && (
                    <div className="flex items-center justify-between w-full">
                       <span className="text-[14px] font-bold tracking-tight uppercase italic">{item.name}</span>
                       {item.badge && (
                         <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black px-1.5 py-0">
                           {item.badge}
                         </Badge>
                       )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          {!isCollapsed ? (
            <div className="bg-zinc-900/50 rounded-[24px] p-5 border border-white/5 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
                    <img 
                       src="/founder.png" 
                       alt="Profile" 
                       className="w-full h-full rounded-full object-cover" 
                       onError={(e) => {
                         e.currentTarget.src = 'https://github.com/shadcn.png';
                       }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-white italic truncate w-24">@{adminAgent?.alias || adminAgent?.name.split(' ')[0] || 'Admin'}</span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{adminAgent?.role || 'Agent'}</span>
                  </div>
               </div>
               <button 
                onClick={onLogout}
                className="w-full py-3 bg-zinc-800 hover:bg-rose-500 rounded-[14px] text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2"
               >
                 <LogOut className="w-3 h-3" />
                 Sign Out
               </button>
            </div>
          ) : (
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center h-14 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-rose-500 transition-all shadow-lg"
            >
              <LogOut className="w-6 h-6" />
            </button>
          )}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute top-[100px] right-[-15px] z-50 w-[30px] h-[30px] bg-primary text-primary-foreground rounded-full items-center justify-center shadow-lg transform translate-x-1/2 hover:scale-110 transition-transform active:scale-95"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
      
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
}
