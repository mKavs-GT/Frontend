import React from "react";
import { type User } from "@/lib/api";

interface AdminAgent {
  email: string;
  name: string;
  role: string;
}

interface DemoProps {
  onBack?: () => void;
  user: User;
  onUserUpdated: (user: User) => void;
  onLogout?: () => void;
  adminAgent?: AdminAgent | null;
}

export const Demo = ({ onBack, adminAgent }: DemoProps) => {
  return (
    <div className="flex flex-col h-screen w-full bg-black text-white p-10 font-sans">
      <div className="flex justify-between items-center mb-10">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-zinc-800 hover:bg-white hover:text-black rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
        >
          &larr; Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl">
        <h2 className="text-xl font-bold uppercase tracking-tighter mb-2">Project Workspace</h2>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-[0.2em]">Building something proud today...</p>
      </div>
    </div>
  );
};

export default Demo;
