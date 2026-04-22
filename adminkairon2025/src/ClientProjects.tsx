import React from "react";
import { useAuth } from "./context/AuthContext";

interface AdminAgent {
  email: string;
  name: string;
  role: string;
}

interface ClientProjectsProps {
  onViewProject: (client: any) => void;
  onLogout?: () => void;
  adminAgent?: AdminAgent | null;
}

export default function ClientProjects({ onLogout, adminAgent }: ClientProjectsProps) {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white p-10 font-sans">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold uppercase tracking-tighter italic">
          MKAVS Dashboard <span className="text-zinc-500 font-mono text-sm not-italic ml-2">[Empty Scratchpad]</span>
        </h1>
        <button 
          onClick={onLogout || logout}
          className="px-6 py-2 bg-zinc-800 hover:bg-rose-600 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
        >
          Sign Out
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl">
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-[0.3em]">Ready for development</p>
        <p className="text-zinc-700 text-xs mt-2 uppercase tracking-widest">Logged in as: {adminAgent?.name} ({adminAgent?.role})</p>
      </div>
    </div>
  );
}
