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
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface AdminAgent {
  email: string;
  name: string;
  role: string;
}

interface SidebarProps {
  className?: string;
  onNavigate?: (itemId: string) => void;
  activeItem?: string;
  onLogout?: () => void;
  adminAgent?: AdminAgent | null;
}

// Updated navigation items - remove logout from here
const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/dashboard" },
  { id: "analytics", name: "Analytics", icon: BarChart3, href: "/analytics" },
  { id: "profile", name: "Profile", icon: User, href: "/profile" },
];

export function Sidebar({ className = "", onNavigate, activeItem: externalActiveItem, onLogout, adminAgent }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalActiveItem, setInternalActiveItem] = useState("dashboard");
  
  // Use external activeItem if provided, otherwise use internal state
  const activeItem = externalActiveItem !== undefined ? externalActiveItem : internalActiveItem;

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (itemId: string) => {
    setInternalActiveItem(itemId);
    if (onNavigate) {
      onNavigate(itemId);
    }
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 rounded-xl bg-zinc-900 border border-white/5 shadow-2xl md:hidden hover:bg-zinc-800 transition-all duration-300 active:scale-95"
        aria-label="Toggle sidebar"
      >
        {isOpen ? 
          <X className="h-5 w-5 text-zinc-300" /> : 
          <Menu className="h-5 w-5 text-zinc-300" />
        }
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-30 md:hidden transition-opacity duration-500" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border-r border-white/[0.03] z-40 transition-all duration-500 ease-in-out flex flex-col shadow-[10px_0_50px_rgba(0,0,0,0.5)]",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-24" : "w-72",
          "md:translate-x-0 md:static md:z-auto",
          className
        )}
      >
        {/* Header with logo and collapse button */}
        <div className={cn(
          "flex items-center transition-all duration-500",
          isCollapsed ? "flex-col justify-center gap-8 py-10 px-2" : "justify-between p-7 pb-4"
        )}>
          {!isCollapsed && (
            <div className="flex items-center space-x-3 group cursor-pointer w-full">
              <div className="relative">
                {/* Blue Logo Glow */}
                <div className="absolute -inset-2 bg-blue-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
                
                {/* Premium Icon Container */}
                <div className="relative w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden bg-black/40 border border-white/5 transition-all duration-500 group-hover:border-blue-500/40">
                  <img 
                    src="/mkavs-sidebar-logo.png" 
                    alt="MKAVS" 
                    className="w-full h-full object-cover transition-all" 
                  />
                </div>
              </div>
              
              {/* Vertical Blue Line from Screenshot */}
              <div className="w-0.5 h-8 bg-blue-500/40 rounded-full" />

              <div className="flex flex-col">
                <span className="font-extrabold text-[#3b82f6] text-lg tracking-tight leading-none mb-1 group-hover:text-blue-400 transition-colors duration-300">MKAVS GLOBAL</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-bold italic opacity-80 group-hover:opacity-100 transition-opacity">Tech Dashboard</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="relative group cursor-pointer px-2">
               <div className="absolute -inset-3 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
               <div className="relative w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden bg-black/40 border border-white/5 transition-all duration-500 group-hover:border-blue-500/40">
                 <img src="/mkavs-sidebar-logo.png" alt="MKAVS" className="w-full h-full object-contain p-2" />
               </div>
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className={cn(
              "hidden md:flex items-center justify-center rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all duration-300 shadow-xl hover:shadow-lime-500/10",
              isCollapsed ? "w-10 h-10 mt-2" : "p-2.5"
            )}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id} className="relative">
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      "flex items-center transition-all duration-500 group relative overflow-hidden",
                      isCollapsed 
                        ? "justify-center w-14 h-14 rounded-2xl mx-auto mb-3" 
                        : "w-full space-x-4 px-4 py-4 rounded-2xl text-left",
                      isActive
                        ? isCollapsed 
                          ? "bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] border-blue-400/20" 
                          : "bg-blue-500/5 text-blue-400 font-bold border-l-2 border-blue-500 shadow-[inset_15px_0_30px_-15px_rgba(59,130,246,0.15)]"
                        : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02] border-l-2 border-transparent"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="relative z-10 flex items-center justify-center">
                      <Icon
                        className={cn(
                          "flex-shrink-0 transition-all duration-500",
                          isCollapsed ? "h-7 w-7" : "h-[1.4rem] w-[1.4rem]",
                          isActive 
                            ? isCollapsed ? "text-white" : "text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                            : "text-zinc-600 group-hover:text-zinc-300 group-hover:scale-110"
                        )}
                      />
                    </div>
                    
                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full relative z-10">
                        <span className={cn(
                          "text-[1rem] tracking-tight transition-all duration-500",
                          isActive ? "text-white" : ""
                        )}>{item.name}</span>
                        {item.badge && (
                          <Badge className={cn(
                            "px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                            isActive ? "bg-blue-500/20 text-blue-400" : "bg-zinc-800 text-zinc-500"
                          )}>
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="p-6 mt-auto space-y-4">
          {/* Profile Card */}
          <div className={cn(
             "rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-500 group cursor-pointer hover:bg-zinc-900/60 hover:border-white/10",
             isCollapsed ? "p-3" : "p-4" 
          )}>
             <div className={cn("flex items-center", isCollapsed ? "justify-center" : "")}>
               <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-white/10 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-500">
                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                       {(() => {
                         // Map agent to character image (same logic as ProfileView)
                         let profileImage = "/founder.png"; // Default to founder
                         
                         if (adminAgent) {
                           let agentKey = "";
                           
                           // Method 1: Try exact name or first 3 chars
                           if (adminAgent.name) {
                             const exactName = adminAgent.name.toUpperCase().trim();
                             if (["MRK", "MRV", "MRS", "MRM", "MRA"].includes(exactName)) {
                               agentKey = exactName;
                             } else {
                               const nameKey = exactName.substring(0, 3);
                               if (["MRK", "MRV", "MRS", "MRM", "MRA"].includes(nameKey)) {
                                 agentKey = nameKey;
                               }
                             }
                           }
                           
                           // Method 2: Try from email pattern
                           if (!agentKey && adminAgent.email) {
                             const emailMatch = adminAgent.email.match(/agent\d+(\w{3})/i);
                             if (emailMatch && emailMatch[1]) {
                               const emailKey = emailMatch[1].toUpperCase();
                               if (["MRK", "MRV", "MRS", "MRM", "MRA"].includes(emailKey)) {
                                 agentKey = emailKey;
                               }
                             }
                           }
                           
                           // Method 3: Try from role
                           if (!agentKey && adminAgent.role) {
                             const roleLower = adminAgent.role.toLowerCase();
                             if (roleLower.includes('founder')) agentKey = 'MRK';
                             else if (roleLower.includes('cto')) agentKey = 'MRV';
                             else if (roleLower.includes('designer')) agentKey = 'MRS';
                             else if (roleLower.includes('senior developer') || roleLower.includes('backend')) agentKey = 'MRM';
                             else if (roleLower.includes('frontend developer') || roleLower.includes('frontend')) agentKey = 'MRA';
                           }
                           
                           // Map agent key to image
                           switch(agentKey) {
                             case "MRK": profileImage = "/founder.png"; break;
                             case "MRV": profileImage = "/mrv.png"; break;
                             case "MRS": profileImage = "/mrss.png"; break;
                             case "MRM": profileImage = "/mrm.png"; break;
                             case "MRA": profileImage = "/mra.png"; break;
                             default: profileImage = "/founder.png";
                           }
                         }
                         
                         return (
                           <img 
                             src={profileImage} 
                             alt="Profile" 
                             className="w-full h-full object-cover scale-150"
                             style={{ objectPosition: 'center 20%' }}
                             onError={(e) => {
                               e.currentTarget.style.display = 'none';
                               e.currentTarget.parentElement!.innerHTML = `<span class="font-black text-white text-[10px] tracking-tighter uppercase">${adminAgent ? adminAgent.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'AD'}</span>`;
                             }}
                           />
                         );
                       })()}
                    </div>
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-500 border-4 border-zinc-900 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20"></div>
               </div>
               
               {!isCollapsed && (
                 <div className="ml-4 flex-1 overflow-hidden">
                   <p className="text-[13px] font-black text-white truncate tracking-tight uppercase group-hover:text-blue-400 transition-colors duration-300">
                     {adminAgent?.name || 'Admin Agent'}
                   </p>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest leading-none">
                           {adminAgent?.role || 'Agent'}
                         </p>
                      </div>
                   </div>
                 </div>
               )}
             </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (onLogout) {
                onLogout();
              } else {
                handleItemClick("logout");
              }
            }}
            className={cn(
              "w-full flex items-center rounded-2xl transition-all duration-500 group border border-transparent hover:bg-red-500/10 hover:border-red-500/20",
              isCollapsed ? "justify-center p-4" : "space-x-4 px-5 py-4"
            )}
          >
            <LogOut className="h-5 w-5 text-zinc-600 group-hover:text-red-400 group-hover:rotate-12 transition-all duration-500" />
            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-red-400">Sign Out</span>}
          </button>
        </div>
      </div>

    </>
  );
}
