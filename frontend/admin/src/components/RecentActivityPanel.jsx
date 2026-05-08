import { motion } from 'framer-motion';
import { CheckCircle, Clock, Plus, User, MessageSquare, Zap } from 'lucide-react';

export default function RecentActivityPanel() {
  const activities = [
    { id: 1, type: 'approval', user: 'Mr.K', target: 'Project X Milestone', time: '12 mins ago', icon: <CheckCircle size={14} className="text-emerald-500" /> },
    { id: 2, type: 'create', user: 'Mrs.S', target: 'Client CRM Ticket', time: '45 mins ago', icon: <Plus size={14} className="text-[#4a154b]" /> },
    { id: 3, type: 'comment', user: 'Mr.M', target: 'Vault Security Update', time: '2 hours ago', icon: <MessageSquare size={14} className="text-[#6a737d]" /> },
    { id: 4, type: 'timer', user: 'Mr.V', target: 'Deep Work Session', time: '3 hours ago', icon: <Zap size={14} className="text-amber-500" /> },
    { id: 5, type: 'join', user: 'Agent 07', target: 'Marketing Team', time: '5 hours ago', icon: <User size={14} className="text-blue-500" /> },
  ];

  return (
    <div className="bg-white border border-[#e1e4e8] rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-[#f9f9fb] border-b border-[#e1e4e8] flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-[#6a737d] uppercase tracking-widest">Recent Activity</h3>
        <button className="text-[10px] font-bold text-[#4a154b] hover:underline uppercase">View All</button>
      </div>
      <div className="divide-y divide-[#e1e4e8]">
        {activities.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="px-4 py-4 hover:bg-[#f9f9fb] transition-colors cursor-pointer group"
          >
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <div className="p-1.5 bg-[#f3f4f6] rounded-md group-hover:bg-white transition-colors border border-transparent group-hover:border-[#e1e4e8]">
                  {activity.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1a1a1b] leading-tight">
                  <span className="font-bold">{activity.user}</span> {activity.type === 'approval' ? 'approved' : activity.type === 'create' ? 'created' : activity.type === 'comment' ? 'commented on' : activity.type === 'timer' ? 'started' : 'joined'} <span className="font-medium text-[#6a737d]">{activity.target}</span>
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock size={10} className="text-[#6a737d]" />
                  <span className="text-[10px] font-medium text-[#6a737d]">{activity.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
