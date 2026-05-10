import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, Zap, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function AnalyticsDashboard({ projects = [] }) {
  const activeProjects = projects || [];
  const totalProjects = activeProjects.length;
  
  const averageProgress = totalProjects > 0 
    ? Math.round(activeProjects.reduce((acc, p) => acc + (p.overallProgress || 0), 0) / totalProjects)
    : 0;

  const getBucketColor = (progress) => {
    if (progress <= 25) return 'bg-rose-500';
    if (progress <= 50) return 'bg-amber-500';
    if (progress <= 75) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  const buckets = {
    atRisk: activeProjects.filter(p => (p.overallProgress || 0) <= 25).length,
    early: activeProjects.filter(p => (p.overallProgress || 0) > 25 && (p.overallProgress || 0) <= 50).length,
    onTrack: activeProjects.filter(p => (p.overallProgress || 0) > 50 && (p.overallProgress || 0) <= 75).length,
    almostDone: activeProjects.filter(p => (p.overallProgress || 0) > 75).length
  };

  const stats = [
    { label: 'Revenue', value: '$42,500', trend: '+12.5%', isUp: true, icon: <DollarSign size={20} className="text-text-main" /> },
    { label: 'Active Projects', value: totalProjects.toString(), trend: '-', isUp: true, icon: <Activity size={20} className="text-text-main" /> },
    { label: 'Avg. Response Time', value: '1.2h', trend: '-15%', isUp: true, icon: <Zap size={20} className="text-text-main" /> },
    { label: 'Team Capacity', value: '88%', trend: '-2%', isUp: false, icon: <Users size={20} className="text-text-main" /> },
  ];

  return (
    <div className="space-y-8 pb-10 transition-colors">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-bg-surface border border-border-main rounded-xl hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-bg-muted rounded-lg group-hover:bg-text-main group-hover:text-bg-surface transition-colors">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend}
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black tracking-tight mt-1 text-text-main">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 p-8 bg-bg-surface border border-border-main rounded-xl transition-all">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black tracking-tight text-text-main">Productivity Index</h3>
              <p className="text-xs text-text-muted">Performance over the last 30 days</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-bg-muted text-text-main text-[10px] font-bold rounded hover:bg-border-main transition-colors border border-border-main">7D</button>
              <button className="px-3 py-1 bg-text-main text-bg-surface text-[10px] font-bold rounded shadow-sm border border-text-main">30D</button>
            </div>
          </div>
          
          <div className="h-[240px] w-full bg-bg-root rounded-lg border border-border-main/50 flex items-end p-4 gap-2">
            {[40, 65, 45, 90, 75, 55, 80, 95, 60, 40, 70, 85, 90, 100].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 100 }}
                className="flex-1 bg-text-main rounded-t-sm opacity-20 hover:opacity-100 transition-opacity relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-main text-bg-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {h}% Eff.
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-text-muted uppercase tracking-widest px-2">
             <span>Apr 01</span>
             <span>Apr 15</span>
             <span>Apr 30</span>
          </div>
        </div>

        {/* Side Progress Cards */}
        <div className="space-y-6">
           <div className="p-6 bg-bg-surface border border-border-main rounded-xl transition-all">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black tracking-tight text-text-main">Project Status</h3>
                <span className="text-[10px] font-bold bg-bg-muted px-2 py-0.5 rounded border border-border-main text-text-main">{averageProgress}% Avg</span>
             </div>
             
             {totalProjects === 0 ? (
               <div className="text-center py-6 text-[10px] font-bold text-text-muted uppercase tracking-widest border border-dashed border-border-main rounded-lg">
                 No active projects yet
               </div>
             ) : (
               <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
                 {activeProjects.map(p => {
                   const val = p.overallProgress || 0;
                   const color = getBucketColor(val);
                   return (
                     <div key={p._id} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-text-main">
                          <span className="truncate max-w-[140px]" title={p.name}>{p.name}</span>
                          <span>{val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            className={`h-full ${color}`}
                          />
                        </div>
                     </div>
                   );
                 })}
               </div>
             )}
             
             {totalProjects > 0 && (
               <div className="mt-6 pt-4 border-t border-border-main grid grid-cols-4 gap-2">
                 <div className="text-center group relative cursor-help">
                   <div className="text-sm font-black text-rose-500">{buckets.atRisk}</div>
                   <div className="text-[8px] font-bold text-text-muted uppercase mt-1">Risk</div>
                   <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-text-main text-bg-surface text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">0-25%</div>
                 </div>
                 <div className="text-center group relative cursor-help">
                   <div className="text-sm font-black text-amber-500">{buckets.early}</div>
                   <div className="text-[8px] font-bold text-text-muted uppercase mt-1">Early</div>
                   <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-text-main text-bg-surface text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">26-50%</div>
                 </div>
                 <div className="text-center group relative cursor-help">
                   <div className="text-sm font-black text-blue-500">{buckets.onTrack}</div>
                   <div className="text-[8px] font-bold text-text-muted uppercase mt-1">Track</div>
                   <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-text-main text-bg-surface text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">51-75%</div>
                 </div>
                 <div className="text-center group relative cursor-help">
                   <div className="text-sm font-black text-emerald-500">{buckets.almostDone}</div>
                   <div className="text-[8px] font-bold text-text-muted uppercase mt-1">Done</div>
                   <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-text-main text-bg-surface text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">76-100%</div>
                 </div>
               </div>
             )}
           </div>

        </div>
      </div>
    </div>
  );
}
