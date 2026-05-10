import { motion } from 'framer-motion';
import RecentActivityPanel from './RecentActivityPanel';

export default function Logs() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-black tracking-tight text-[#1a1a1b]">System Audit Logs</h2>
        <p className="text-sm text-[#6a737d] mt-1">Real-time stream of all system activities, authentication events, and team actions.</p>
      </div>
      <RecentActivityPanel />
    </div>
  );
}
