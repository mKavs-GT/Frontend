import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Plus, Trash2, ArrowRight, Settings } from 'lucide-react';

const initialColumns = [
  { id: 'backlog', title: 'Backlog', tasks: [
    { id: 1, title: 'Design System Update', assignee: 'https://i.pravatar.cc/150?u=sarah', tags: [{name: 'UI/UX', color: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-400'}] },
    { id: 2, title: 'User Onboarding Flow', assignee: 'https://i.pravatar.cc/150?u=mike', tags: [{name: 'Feature', color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}] },
  ]},
  { id: 'in-progress', title: 'In Progress', tasks: [
    { id: 3, title: 'Dashboard Bento Grid', assignee: 'https://i.pravatar.cc/150?u=12', tags: [{name: 'Frontend', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'}, {name: 'High Priority', color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'}] },
    { id: 4, title: 'Authentication API', assignee: 'https://i.pravatar.cc/150?u=elena', tags: [{name: 'Backend', color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'}] },
  ]},
  { id: 'qa', title: 'QA/Testing', tasks: [
    { id: 5, title: 'Payment Gateway Integration', assignee: 'https://i.pravatar.cc/150?u=david', tags: [{name: 'Critical', color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'}] },
  ]},
  { id: 'live', title: 'Live', tasks: [
    { id: 6, title: 'Landing Page V2', assignee: 'https://i.pravatar.cc/150?u=sarah', tags: [{name: 'Marketing', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'}] },
  ]}
];

export default function ProjectManager({ user }) {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('mkavs_kanban_board');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialColumns;
      }
    }
    return initialColumns;
  });

  // Sync back to localStorage ONLY if user is executive
  useEffect(() => {
    if (user?.isExecutive) {
      localStorage.setItem('mkavs_kanban_board', JSON.stringify(columns));
    }
  }, [columns, user]);

  const [pingedTasks, setPingedTasks] = useState(new Set());

  // Calculate dynamic progress
  const totalTasks = columns.reduce((acc, col) => acc + col.tasks.length, 0);
  const liveTasks = columns.find(c => c.id === 'live')?.tasks.length || 0;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((liveTasks / totalTasks) * 100);

  const pingReviewer = (taskId) => {
    setPingedTasks(prev => new Set(prev).add(taskId));
    // Simulate notification logic here
  };

  const moveTaskToLive = (taskId, fromColId) => {
    setColumns(prev => {
      const newCols = [...prev];
      const fromColIndex = newCols.findIndex(c => c.id === fromColId);
      const toColIndex = newCols.findIndex(c => c.id === 'live');
      
      const taskIndex = newCols[fromColIndex].tasks.findIndex(t => t.id === taskId);
      const [task] = newCols[fromColIndex].tasks.splice(taskIndex, 1);
      
      newCols[toColIndex].tasks.push(task);
      return newCols;
    });
  };

  const executiveMoveTask = (taskId, fromColId, direction) => {
    setColumns(prev => {
      const newCols = [...prev];
      const fromColIndex = newCols.findIndex(c => c.id === fromColId);
      const toColIndex = direction === 'next' ? fromColIndex + 1 : fromColIndex - 1;
      
      if (toColIndex < 0 || toColIndex >= newCols.length) return prev;

      const taskIndex = newCols[fromColIndex].tasks.findIndex(t => t.id === taskId);
      const [task] = newCols[fromColIndex].tasks.splice(taskIndex, 1);
      
      newCols[toColIndex].tasks.push(task);
      return newCols;
    });
  };

  const executiveRemoveTask = (taskId, colId) => {
    setColumns(prev => {
      const newCols = [...prev];
      const colIndex = newCols.findIndex(c => c.id === colId);
      newCols[colIndex].tasks = newCols[colIndex].tasks.filter(t => t.id !== taskId);
      return newCols;
    });
  };

  const executiveAddTask = (colId) => {
    setColumns(prev => {
      const newCols = [...prev];
      const colIndex = newCols.findIndex(c => c.id === colId);
      newCols[colIndex].tasks.unshift({
        id: Math.random(),
        title: 'New Assigned Task',
        assignee: 'https://i.pravatar.cc/150?u=new',
        tags: [{name: 'New', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'}]
      });
      return newCols;
    });
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Progress Bar */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 relative z-10 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Website Redesign MVP</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">Sprint 4 • Due in 5 Days</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{progressPercentage}%</span>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mt-1">Completed</p>
          </div>
        </div>
        <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden shadow-inner relative z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, type: 'spring', bounce: 0.2 }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
          </motion.div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory min-h-[400px]">
        {columns.map((column, colIndex) => (
          <div key={column.id} className="snap-start flex-1 min-w-[300px] bg-zinc-50/50 dark:bg-zinc-900/30 rounded-[2rem] p-5 border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-5 backdrop-blur-sm">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-zinc-900 dark:text-white text-lg tracking-tight">{column.title}</h4>
                <span className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {column.tasks.length}
                </span>
              </div>
              {user?.isExecutive && (
                <button 
                  onClick={() => executiveAddTask(column.id)}
                  className="w-7 h-7 rounded-lg bg-zinc-200/50 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition-colors"
                  title="Admin: Add Task"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-4 flex-1">
              <AnimatePresence>
                {column.tasks.map((task, index) => (
                  <motion.div
                    layout
                    layoutId={`task-${task.id}`}
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white dark:bg-zinc-900/80 p-5 rounded-[1.5rem] shadow-sm hover:shadow-lg border border-zinc-200/80 dark:border-zinc-700/50 cursor-grab hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-colors duration-300 group flex flex-col"
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {task.tags.map((tag, i) => (
                        <span key={i} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${tag.color}`}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-start mb-5">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pr-4">
                        {task.title}
                      </p>
                      {user?.isExecutive && (
                        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-zinc-400 hover:text-indigo-500 transition-colors" title="Edit Priority/Assignee"><Settings size={14}/></button>
                          <button onClick={() => executiveRemoveTask(task.id, column.id)} className="text-zinc-400 hover:text-rose-500 transition-colors" title="Delete Task"><Trash2 size={14}/></button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-end mt-auto">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1.5 opacity-60">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        </div>
                        {/* Peer Review Trigger specifically for QA/Testing */}
                        {column.id === 'qa' && (
                          <button 
                            onClick={() => pingReviewer(task.id)}
                            disabled={pingedTasks.has(task.id)}
                            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                              pingedTasks.has(task.id) 
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20'
                            }`}
                          >
                            {pingedTasks.has(task.id) ? (
                              <><CheckCircle2 size={14} /> Pinged Tester</>
                            ) : (
                              <><Send size={12} /> Request Review</>
                            )}
                          </button>
                        )}
                        {/* Mock Move to Live Button (Original) */}
                        {!user?.isExecutive && column.id === 'qa' && pingedTasks.has(task.id) && (
                          <button 
                            onClick={() => moveTaskToLive(task.id, column.id)}
                            className="mt-1 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          >
                            Move to Live →
                          </button>
                        )}
                        {/* Executive Admin Move Next Button */}
                        {user?.isExecutive && colIndex < columns.length - 1 && (
                          <button 
                            onClick={() => executiveMoveTask(task.id, column.id, 'next')}
                            className="flex items-center gap-1 mt-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-1 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors w-fit"
                          >
                            Admin Move <ArrowRight size={10} />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex -space-x-2 shrink-0">
                        <img 
                          src={task.assignee} 
                          alt="Assignee" 
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
