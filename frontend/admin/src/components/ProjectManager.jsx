import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Layout, 
  PlusCircle, 
  Clock,
  MoreVertical,
  CheckCircle2,
  Circle,
  GripVertical
} from 'lucide-react';

// Task columns helper
const COLUMN_TITLES = {
  allTasks: 'All Tasks',
  ongoing: 'Ongoing',
  testing: 'Testing',
  live: 'Live'
};

export default function ProjectManager({ user }) {
  const [projects, setProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [activeSprintMap, setActiveSprintMap] = useState({}); // { projectId: sprintId }
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [projectFormData, setProjectFormData] = useState({ name: '', description: '' });
  const [sprintFormData, setSprintFormData] = useState({ dueDate: '' });

  // Fetch all projects on mount and set up polling for "realtime" feel
  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin-projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        
        // Auto-expand first project if none expanded
        if (expandedProjects.size === 0 && data.length > 0) {
          setExpandedProjects(new Set([data[0]._id]));
          // Default to first sprint
          if (data[0].sprints.length > 0) {
            setActiveSprintMap(prev => ({ ...prev, [data[0]._id]: data[0].sprints[0]._id }));
          }
        }
      }
    } catch (err) {
      console.error('Fetch projects failed:', err);
    }
  };

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectFormData.name) return;

    try {
      const res = await fetch('/api/admin-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectFormData)
      });
      if (res.ok) {
        const newProject = await res.json();
        setProjects(prev => [...prev, newProject]);
        setIsProjectModalOpen(false);
        setProjectFormData({ name: '', description: '' });
        setExpandedProjects(prev => new Set(prev).add(newProject._id));
      }
    } catch (err) {
      console.error('Create project failed:', err);
    }
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    if (!sprintFormData.dueDate || !selectedProjectId) return;

    try {
      const res = await fetch(`/api/admin-projects/${selectedProjectId}/sprints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sprintFormData)
      });
      if (res.ok) {
        const updatedProject = await res.json();
        setProjects(prev => prev.map(p => p._id === selectedProjectId ? updatedProject : p));
        setIsSprintModalOpen(false);
        setSprintFormData({ dueDate: '' });
        
        // Set new sprint as active
        const newSprint = updatedProject.sprints[updatedProject.sprints.length - 1];
        setActiveSprintMap(prev => ({ ...prev, [selectedProjectId]: newSprint._id }));
      }
    } catch (err) {
      console.error('Create sprint failed:', err);
    }
  };

  const moveTask = async (projectId, sprintId, task, fromCol, toCol) => {
    if (fromCol === toCol) return;
    
    // Find project and sprint
    const project = projects.find(p => p._id === projectId);
    const sprint = project.sprints.find(s => s._id === sprintId);
    
    // Deep clone columns
    const newColumns = JSON.parse(JSON.stringify(sprint.columns));
    
    // Remove from old column
    newColumns[fromCol] = newColumns[fromCol].filter(t => t.id !== task.id);
    
    // Add to new column
    newColumns[toCol].push(task);

    // Calculate new progress
    const total = Object.values(newColumns).reduce((acc, col) => acc + col.length, 0);
    const live = newColumns.live.length;
    const progress = total === 0 ? 0 : Math.round((live / total) * 100);

    // Optimistic update
    setProjects(prev => prev.map(p => {
      if (p._id === projectId) {
        return {
          ...p,
          sprints: p.sprints.map(s => s._id === sprintId ? { ...s, columns: newColumns, progress } : s)
        };
      }
      return p;
    }));

    // Sync to backend
    try {
      await fetch(`/api/admin-projects/${projectId}/sprints/${sprintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columns: newColumns, progress })
      });
    } catch (err) {
      console.error('Sync task move failed:', err);
      fetchProjects(); // Rollback
    }
  };

  const addTask = async (projectId, sprintId, columnKey) => {
    const content = prompt("Enter task title:");
    if (!content) return;

    const project = projects.find(p => p._id === projectId);
    const sprint = project.sprints.find(s => s._id === sprintId);
    const newColumns = JSON.parse(JSON.stringify(sprint.columns));
    
    newColumns[columnKey].push({
      id: Math.random().toString(36).substr(2, 9),
      content,
      priority: 'medium'
    });

    // Update progress
    const total = Object.values(newColumns).reduce((acc, col) => acc + col.length, 0);
    const live = newColumns.live.length;
    const progress = total === 0 ? 0 : Math.round((live / total) * 100);

    try {
      await fetch(`/api/admin-projects/${projectId}/sprints/${sprintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columns: newColumns, progress })
      });
      fetchProjects();
    } catch (err) {
      console.error('Add task failed:', err);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full pb-20">
      
      {/* Header with New Project Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Projects</h2>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1 opacity-70">Development Cycle & Sprints</p>
        </div>
        {user?.isExecutive && (
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-6">
        {projects.length === 0 ? (
          <div className="bg-white/50 dark:bg-zinc-900/30 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-12 text-center">
            <Layout size={48} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No projects yet</h3>
            <p className="text-zinc-500 font-medium mt-2">Create your first project to start managing sprints.</p>
          </div>
        ) : (
          projects.map(project => (
            <div key={project._id} className="flex flex-col gap-4">
              {/* Project Header Card */}
              <div 
                className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-all ${expandedProjects.has(project._id) ? 'border-indigo-500/30' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleProject(project._id)}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${expandedProjects.has(project._id) ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                      {expandedProjects.has(project._id) ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{project.name}</h3>
                      <p className="text-sm text-zinc-500 font-medium truncate max-w-md">{project.description || 'No description provided.'}</p>
                    </div>
                  </div>
                  
                  {user?.isExecutive && (
                    <button 
                      onClick={() => { setSelectedProjectId(project._id); setIsSprintModalOpen(true); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                    >
                      <PlusCircle size={18} />
                      <span>Add Sprint</span>
                    </button>
                  )}
                </div>

                {/* Sprints Horizontal List (Inside Project Card) */}
                <AnimatePresence>
                  {expandedProjects.has(project._id) && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 flex flex-wrap gap-3">
                        {project.sprints.length === 0 ? (
                          <p className="text-sm font-bold text-zinc-400 italic py-2 ml-2">No sprints yet. Add your first sprint.</p>
                        ) : (
                          project.sprints.map(sprint => (
                            <button
                              key={sprint._id}
                              onClick={() => setActiveSprintMap(prev => ({ ...prev, [project._id]: sprint._id }))}
                              className={`px-5 py-3 rounded-2xl border transition-all flex flex-col items-start gap-1 ${
                                activeSprintMap[project._id] === sprint._id
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                  : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-indigo-500/50'
                              }`}
                            >
                              <span className="text-xs font-black uppercase tracking-tighter opacity-80">{sprint.name}</span>
                              <span className="text-xs font-bold whitespace-nowrap">{sprint.dueDate}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Active Sprint Dashboard (Kanban) */}
              <AnimatePresence>
                {expandedProjects.has(project._id) && activeSprintMap[project._id] && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="flex flex-col gap-6 mt-2"
                  >
                    {/* Sprint Meta Info */}
                    {project.sprints.filter(s => s._id === activeSprintMap[project._id]).map(sprint => (
                      <div key={sprint._id} className="bg-zinc-50/50 dark:bg-zinc-950/20 rounded-[2.5rem] p-8 border border-zinc-200/50 dark:border-zinc-800/20">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-6">
                            <div>
                              <h4 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{sprint.name} Dashboard</h4>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-sm font-bold text-zinc-500">
                                  <Clock size={14} /> Due: {sprint.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{sprint.progress}%</span>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Sprint Progress</p>
                          </div>
                        </div>

                        {/* Kanban Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {Object.entries(COLUMN_TITLES).map(([key, title]) => (
                            <div key={key} className="bg-white/50 dark:bg-zinc-900/30 rounded-[2rem] p-5 border border-zinc-200/30 dark:border-zinc-800/30 flex flex-col gap-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-black text-zinc-900 dark:text-white uppercase tracking-tighter text-sm opacity-80">{title}</h5>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">{sprint.columns[key].length}</span>
                                  {user?.isExecutive && (
                                    <button 
                                      onClick={() => addTask(project._id, sprint._id, key)}
                                      className="text-zinc-400 hover:text-indigo-600 transition-colors"
                                    >
                                      <Plus size={16} />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col gap-3 min-h-[100px]">
                                {sprint.columns[key].map(task => (
                                  <div 
                                    key={task.id} 
                                    className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 group relative"
                                  >
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight pr-6">{task.content}</p>
                                    
                                    <div className="flex items-center justify-between mt-4">
                                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                        task.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 
                                        task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 
                                        'bg-indigo-500/10 text-indigo-500'
                                      }`}>
                                        {task.priority}
                                      </span>
                                      
                                      {/* Quick Move Button */}
                                      {user?.isExecutive && (
                                        <div className="flex gap-1">
                                          {key !== 'live' && (
                                            <button 
                                              onClick={() => {
                                                const keys = Object.keys(COLUMN_TITLES);
                                                const nextKey = keys[keys.indexOf(key) + 1];
                                                moveTask(project._id, sprint._id, task, key, nextKey);
                                              }}
                                              className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 transition-all"
                                            >
                                              <ChevronRight size={16} />
                                            </button>
                                          )}
                                        </div>
                                      )}
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
          ))
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <Modal onClose={() => setIsProjectModalOpen(false)} title="New Project">
            <form onSubmit={handleCreateProject} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Project Name</label>
                <input 
                  type="text"
                  required
                  autoFocus
                  value={projectFormData.name}
                  onChange={e => setProjectFormData({ ...projectFormData, name: e.target.value })}
                  placeholder="e.g. MKAVS Website Launch"
                  className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Description (Optional)</label>
                <textarea 
                  value={projectFormData.description}
                  onChange={e => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold resize-none"
                />
              </div>
              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
                Create Project
              </button>
            </form>
          </Modal>
        )}

        {isSprintModalOpen && (
          <Modal onClose={() => setIsSprintModalOpen(false)} title="Add New Sprint">
            <form onSubmit={handleCreateSprint} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Due Date</label>
                <input 
                  type="date"
                  required
                  autoFocus
                  value={sprintFormData.dueDate}
                  onChange={e => setSprintFormData({ ...sprintFormData, dueDate: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                />
              </div>
              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
                Create Sprint
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable Modal Component
function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
