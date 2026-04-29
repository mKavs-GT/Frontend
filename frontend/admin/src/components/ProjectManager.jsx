import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Layout, 
  PlusCircle, 
  Clock,
  CheckCircle2,
  Users,
  AlertCircle
} from 'lucide-react';
import { TEAM_MEMBERS } from '../constants/users';

const COLUMN_TITLES = {
  allTasks: 'All Tasks',
  ongoing: 'Ongoing',
  testing: 'Testing',
  approval: 'Approval',
  live: 'Live'
};

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function ProjectManager({ user, projects = [], onRefresh }) {
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [activeSprintMap, setActiveSprintMap] = useState({});
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedSprintId, setSelectedSprintId] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const [projectFormData, setProjectFormData] = useState({ name: '', description: '' });
  const [sprintFormData, setSprintFormData] = useState({ dueDate: '' });
  const [taskFormData, setTaskFormData] = useState({ content: '', priority: 'medium', assignees: [] });

  useEffect(() => {
    if (expandedProjects.size === 0 && projects.length > 0) {
      setExpandedProjects(new Set([projects[0]._id]));
      if (projects[0].sprints.length > 0) {
        setActiveSprintMap(prev => ({ ...prev, [projects[0]._id]: projects[0].sprints[0]._id }));
      }
    }
  }, [projects]);

  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectFormData)
      });
      if (res.ok) {
        onRefresh();
        setIsProjectModalOpen(false);
        setProjectFormData({ name: '', description: '' });
      }
    } catch (err) {
      console.error('Create project failed:', err);
    }
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin-projects/${selectedProjectId}/sprints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sprintFormData)
      });
      if (res.ok) {
        onRefresh();
        setIsSprintModalOpen(false);
        setSprintFormData({ dueDate: '' });
      }
    } catch (err) {
      console.error('Create sprint failed:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskFormData.content || taskFormData.assignees.length === 0) return;

    const project = projects.find(p => p._id === selectedProjectId);
    const sprint = project.sprints.find(s => s._id === selectedSprintId);
    const newColumns = JSON.parse(JSON.stringify(sprint.columns));
    
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      content: taskFormData.content,
      priority: taskFormData.priority,
      assignees: taskFormData.assignees,
      createdAt: new Date().toISOString()
    };

    newColumns[selectedColumn].push(newTask);

    // Calculate progress
    const total = Object.values(newColumns).reduce((acc, col) => acc + col.length, 0);
    const live = newColumns.live.length;
    const progress = total === 0 ? 0 : Math.round((live / total) * 100);

    try {
      await fetch(`/api/admin-projects/${selectedProjectId}/sprints/${selectedSprintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columns: newColumns, progress, newTask })
      });
      onRefresh();
      setIsTaskModalOpen(false);
      setTaskFormData({ content: '', priority: 'medium', assignees: [] });
    } catch (err) {
      console.error('Create task failed:', err);
    }
  };

  const moveTask = async (projectId, sprintId, taskId, fromCol, toCol) => {
    try {
      const res = await fetch(`/api/admin-projects/${projectId}/sprints/${sprintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transition: { taskId, fromCol, toCol }
        })
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to move task');
        return;
      }
      
      onRefresh();
    } catch (err) {
      console.error('Move task failed:', err);
      alert('Network error moving task');
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Projects</h2>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1 opacity-70">Team Management & Sprints</p>
        </div>
        {user?.isExecutive && (
          <button onClick={() => setIsProjectModalOpen(true)} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {projects.map(project => (
          <div key={project._id} className="flex flex-col gap-4">
            <div className={`bg-white dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all ${expandedProjects.has(project._id) ? 'border-indigo-500/30' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => {
                  setExpandedProjects(prev => {
                    const next = new Set(prev);
                    if (next.has(project._id)) next.delete(project._id);
                    else next.add(project._id);
                    return next;
                  });
                }}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${expandedProjects.has(project._id) ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                    {expandedProjects.has(project._id) ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{project.name}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">{project.description || 'Global project objectives.'}</p>
                  </div>
                </div>
                {user?.isExecutive && (
                  <button onClick={() => { setSelectedProjectId(project._id); setIsSprintModalOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                    <PlusCircle size={18} />
                    <span>Add Sprint</span>
                  </button>
                )}
              </div>

              <AnimatePresence>
                {expandedProjects.has(project._id) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pt-8 flex flex-wrap gap-3">
                      {project.sprints.map(sprint => (
                        <button key={sprint._id} onClick={() => setActiveSprintMap(prev => ({ ...prev, [project._id]: sprint._id }))} className={`px-5 py-3 rounded-2xl border transition-all flex flex-col items-start gap-1 ${activeSprintMap[project._id] === sprint._id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-indigo-500/50'}`}>
                          <span className="text-xs font-black uppercase tracking-tighter opacity-80">{sprint.name}</span>
                          <span className="text-xs font-bold whitespace-nowrap">{sprint.dueDate}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {expandedProjects.has(project._id) && activeSprintMap[project._id] && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="flex flex-col gap-6">
                  {project.sprints.filter(s => s._id === activeSprintMap[project._id]).map(sprint => (
                    <div key={sprint._id} className="bg-white dark:bg-zinc-950/20 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800/20 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h4 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{sprint.name}</h4>
                          <span className="flex items-center gap-1.5 text-sm font-bold text-zinc-600 dark:text-zinc-500 mt-1"><Clock size={14} /> Due: {sprint.dueDate}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{sprint.progress}%</span>
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Sprint Progress</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {Object.entries(COLUMN_TITLES).map(([key, title]) => (
                          <div key={key} className="bg-zinc-50/50 dark:bg-zinc-900/30 rounded-[2rem] p-5 border border-zinc-200/50 dark:border-zinc-800/30 flex flex-col gap-4">
                            <div className="flex items-center justify-between mb-2 px-1">
                              <h5 className="font-black text-zinc-900 dark:text-white uppercase tracking-tighter text-xs opacity-70">{title}</h5>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black bg-white dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full shadow-sm">{(sprint.columns[key] || []).length}</span>
                                {user?.isExecutive && (
                                  <button 
                                    onClick={() => {
                                      setSelectedProjectId(project._id);
                                      setSelectedSprintId(sprint._id);
                                      setSelectedColumn(key);
                                      setIsTaskModalOpen(true);
                                    }} 
                                    className="flex items-center gap-1 text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-all"
                                  >
                                    <Plus size={12} />
                                    <span>ADD TASK</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-3 min-h-[100px]">
                              {sortTasks(sprint.columns[key] || []).map(task => (
                                <div key={task.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 group relative">
                                  <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight pr-6 mb-3">{task.content}</p>
                                  
                                  {/* Workflow Actions */}
                                  <div className="mb-4">
                                    {key === 'allTasks' && task.assignees.some(a => a.userId === user.email || a.userId === user.uid) && (
                                      <button onClick={() => moveTask(project._id, sprint._id, task.id, 'allTasks', 'ongoing')} className="w-full py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm active:scale-95">Accept Task</button>
                                    )}
                                    {key === 'ongoing' && task.assignees.some(a => a.userId === user.email || a.userId === user.uid) && (
                                      <label className="flex items-center gap-2 cursor-pointer group/check">
                                        <input type="checkbox" onChange={() => moveTask(project._id, sprint._id, task.id, 'ongoing', 'testing')} className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="text-[10px] font-bold text-zinc-500 group-hover/check:text-indigo-600 uppercase tracking-widest">Mark as Done</span>
                                      </label>
                                    )}
                                    {key === 'testing' && user.email === 'agent05mrm@gmail.com' && (
                                      <button onClick={() => moveTask(project._id, sprint._id, task.id, 'testing', 'approval')} className="w-full py-2 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-sm active:scale-95">Testing Complete</button>
                                    )}
                                    {key === 'approval' && user.email === 'agent01mrk@gmail.com' && (
                                      <button onClick={() => moveTask(project._id, sprint._id, task.id, 'approval', 'live')} className="w-full py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm active:scale-95">Approve & Live</button>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex -space-x-2">
                                      {task.assignees.map((a, i) => (
                                        <img key={i} src={a.avatar} alt={a.name} title={a.name} className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900" />
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                        task.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 
                                        task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 
                                        'bg-indigo-500/10 text-indigo-500'
                                      }`}>
                                        {task.priority}
                                      </span>
                                      {user?.isExecutive && !['approval', 'live'].includes(key) && (
                                        <button onClick={() => {
                                          const keys = Object.keys(COLUMN_TITLES);
                                          const nextKey = keys[keys.indexOf(key) + 1];
                                          moveTask(project._id, sprint._id, task.id, key, nextKey);
                                        }} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600">
                                          <ChevronRight size={14} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isProjectModalOpen && (
          <Modal onClose={() => setIsProjectModalOpen(false)} title="New Project">
            <form onSubmit={handleCreateProject} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Project Name</label>
                <input type="text" required autoFocus value={projectFormData.name} onChange={e => setProjectFormData({ ...projectFormData, name: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold" />
              </div>
              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-95">Create Project</button>
            </form>
          </Modal>
        )}

        {isSprintModalOpen && (
          <Modal onClose={() => setIsSprintModalOpen(false)} title="Add New Sprint">
            <form onSubmit={handleCreateSprint} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Due Date</label>
                <input type="date" required autoFocus value={sprintFormData.dueDate} onChange={e => setSprintFormData({ ...sprintFormData, dueDate: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold" />
              </div>
              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-95">Create Sprint</button>
            </form>
          </Modal>
        )}

        {isTaskModalOpen && (
          <Modal onClose={() => setIsTaskModalOpen(false)} title="New Task">
            <form onSubmit={handleCreateTask} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Task Content</label>
                <textarea required autoFocus value={taskFormData.content} onChange={e => setTaskFormData({ ...taskFormData, content: e.target.value })} rows={3} className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold resize-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Priority</label>
                <div className="flex gap-2">
                  {['high', 'medium', 'low'].map(p => (
                    <button key={p} type="button" onClick={() => setTaskFormData({ ...taskFormData, priority: p })} className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold uppercase text-[10px] tracking-widest ${taskFormData.priority === p ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Assign Members</label>
                <div className="grid grid-cols-2 gap-2">
                  {TEAM_MEMBERS.map(member => (
                    <button key={member.uid} type="button" onClick={() => {
                      const exists = taskFormData.assignees.find(a => a.userId === member.uid);
                      setTaskFormData({
                        ...taskFormData,
                        assignees: exists ? taskFormData.assignees.filter(a => a.userId !== member.uid) : [...taskFormData.assignees, { userId: member.uid, name: member.name, avatar: member.avatar }]
                      });
                    }} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${taskFormData.assignees.find(a => a.userId === member.uid) ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' : 'border-zinc-200 dark:border-zinc-800'}`}>
                      <img src={member.avatar} className="w-6 h-6 rounded-full" />
                      <div className="text-left overflow-hidden">
                        <p className="text-[10px] font-bold text-zinc-900 dark:text-white truncate">{member.firstName}</p>
                        <p className="text-[8px] font-medium text-zinc-500 uppercase truncate">{member.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-95">Create Task</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto hide-scrollbar">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><X size={20} /></button>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
