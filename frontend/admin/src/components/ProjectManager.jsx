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
  AlertCircle,
  MoreVertical,
  Activity
} from 'lucide-react';
import { TEAM_MEMBERS } from '../constants/users';
import { API_BASE_URL } from '../config';

const COLUMN_TITLES = {
  allTasks: 'Backlog',
  ongoing: 'In Progress',
  testing: 'Quality Assurance',
  approval: 'Final Approval',
  live: 'Production'
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
  const [sprintFormData, setSprintFormData] = useState({ name: '', dueDate: '' });
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
      const res = await fetch(`${API_BASE_URL}/api/admin-projects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(projectFormData)
      });
      if (res.ok) {
        await onRefresh();
        setIsProjectModalOpen(false);
        setProjectFormData({ name: '', description: '' });
      } else {
        const err = await res.json();
        alert('Failed to create project: ' + (err.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Create project failed:', err);
      alert('Failed to connect to server.');
    }
  };

  const handleAddSprint = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin-projects/${selectedProjectId}/sprints`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(sprintFormData) 
      });
      if (res.ok) {
        await onRefresh();
        setIsSprintModalOpen(false);
        setSprintFormData({ name: '', dueDate: '' });
      } else {
        const err = await res.json();
        alert('Failed to add sprint: ' + (err.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Add sprint failed:', err);
      alert('Failed to connect to server.');
    }
  };

  const moveTask = async (projectId, sprintId, taskId, fromCol, toCol) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin-projects/${projectId}/sprints/${sprintId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ transition: { taskId, fromCol, toCol } })
      });
      if (res.ok) onRefresh();
    } catch (err) {
      console.error('Move task failed:', err);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Area */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Project Hub</h2>
          <p className="text-xs font-bold text-[#6a737d] uppercase tracking-widest mt-1">Manage active sprints and team roadmap</p>
        </div>
        {user?.isExecutive && (
          <button onClick={() => setIsProjectModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1a1a1b] text-white font-bold text-sm hover:bg-black transition-all shadow-sm active:scale-95">
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {projects.map(project => (
          <div key={project._id} className="bg-white border border-[#e1e4e8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            {/* Project Card Header */}
            <div className="p-6 flex items-center justify-between border-b border-[#e1e4e8]">
              <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => {
                setExpandedProjects(prev => {
                  const next = new Set(prev);
                  if (next.has(project._id)) next.delete(project._id);
                  else next.add(project._id);
                  return next;
                });
              }}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${expandedProjects.has(project._id) ? 'bg-[#1a1a1b] text-white' : 'bg-[#f3f4f6] text-[#6a737d]'}`}>
                  {expandedProjects.has(project._id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">{project.name}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-[#6a737d] uppercase tracking-widest mt-0.5">
                    <span className="flex items-center gap-1"><Activity size={12} /> {project.sprints.length} Sprints</span>
                    <span className="w-1 h-1 rounded-full bg-[#d1d5da]"></span>
                    <span>Live Progress: {project.sprints[0]?.progress || 0}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {user?.isExecutive && (
                  <button onClick={() => { setSelectedProjectId(project._id); setIsSprintModalOpen(true); }} className="px-4 py-2 text-xs font-bold bg-[#f3f4f6] text-[#1a1a1b] border border-[#e1e4e8] rounded-lg hover:bg-white transition-all shadow-sm">
                    Add Sprint
                  </button>
                )}
                <button className="p-2 text-[#6a737d] hover:bg-[#f3f4f6] rounded-lg transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedProjects.has(project._id) && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                   {/* Sprint Selector */}
                   <div className="px-6 py-4 bg-[#f9f9fb] border-b border-[#e1e4e8] flex gap-3 overflow-x-auto scrollbar-hide">
                      {project.sprints.map(sprint => (
                        <button 
                          key={sprint._id} 
                          onClick={() => setActiveSprintMap(prev => ({ ...prev, [project._id]: sprint._id }))}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${activeSprintMap[project._id] === sprint._id ? 'bg-[#1a1a1b] text-white border-[#1a1a1b] shadow-sm' : 'bg-white border-[#e1e4e8] text-[#6a737d] hover:bg-[#f3f4f6]'}`}
                        >
                          {sprint.name}
                        </button>
                      ))}
                   </div>

                   {/* Tasks Board */}
                   <div className="p-6">
                      {activeSprintMap[project._id] && project.sprints.filter(s => s._id === activeSprintMap[project._id]).map(sprint => (
                        <div key={sprint._id} className="space-y-8">
                           <div className="flex items-end justify-between">
                             <div className="flex items-center gap-3">
                               <div className="w-1.5 h-10 bg-[#4a154b] rounded-full"></div>
                               <div>
                                 <h4 className="text-xl font-black tracking-tight">{sprint.name}</h4>
                                 <p className="text-[10px] font-bold text-[#6a737d] uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                   <Clock size={12} /> Deadline: {sprint.dueDate}
                                 </p>
                               </div>
                             </div>
                             <div className="text-right">
                               <div className="text-2xl font-black tracking-tight">{sprint.progress}%</div>
                               <div className="w-32 h-1.5 bg-[#f3f4f6] rounded-full mt-1 overflow-hidden">
                                  <motion.div initial={{width:0}} animate={{width:`${sprint.progress}%`}} className="h-full bg-[#1a1a1b]" />
                               </div>
                             </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                              {Object.entries(COLUMN_TITLES).map(([key, title]) => (
                                <div key={key} className="space-y-4">
                                   <div className="flex items-center justify-between px-2">
                                      <h5 className="text-[10px] font-bold text-[#6a737d] uppercase tracking-widest">{title}</h5>
                                      <span className="text-[10px] font-bold bg-[#f3f4f6] text-[#1a1a1b] px-1.5 py-0.5 rounded border border-[#e1e4e8]">
                                        {(sprint.columns[key] || []).length}
                                      </span>
                                   </div>

                                   <div className="space-y-3 min-h-[200px] p-2 bg-[#f9f9fb] rounded-xl border border-dashed border-[#e1e4e8]">
                                      {sortTasks(sprint.columns[key] || []).map(task => (
                                        <motion.div 
                                          key={task.id}
                                          layoutId={task.id}
                                          className="bg-white p-4 rounded-lg border border-[#e1e4e8] shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing"
                                        >
                                           <div className={`w-8 h-1 rounded-full mb-3 ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                           <p className="text-xs font-semibold text-[#1a1a1b] leading-relaxed mb-4">{task.content}</p>
                                           
                                           <div className="flex items-center justify-between">
                                              <div className="flex -space-x-1.5">
                                                {task.assignees.map((a, i) => (
                                                  <img key={i} src={a.avatar} alt="" className="w-6 h-6 rounded-full border-2 border-white" />
                                                ))}
                                              </div>
                                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <button 
                                                   onClick={() => {
                                                     const keys = Object.keys(COLUMN_TITLES);
                                                     const nextKey = keys[keys.indexOf(key) + 1];
                                                     if (nextKey) moveTask(project._id, sprint._id, task.id, key, nextKey);
                                                   }}
                                                   className="p-1.5 bg-[#f3f4f6] rounded border border-[#e1e4e8] text-[#1a1a1b] hover:bg-[#1a1a1b] hover:text-white transition-colors"
                                                 >
                                                   <ChevronRight size={14} />
                                                 </button>
                                              </div>
                                           </div>
                                        </motion.div>
                                      ))}
                                      {user?.isExecutive && (
                                        <button 
                                          onClick={() => {
                                            setSelectedProjectId(project._id);
                                            setSelectedSprintId(sprint._id);
                                            setSelectedColumn(key);
                                            setIsTaskModalOpen(true);
                                          }}
                                          className="w-full py-3 border border-dashed border-[#e1e4e8] rounded-lg text-[10px] font-bold text-[#6a737d] uppercase tracking-widest hover:bg-white hover:border-[#1a1a1b] hover:text-[#1a1a1b] transition-all"
                                        >
                                          + Add Task
                                        </button>
                                      )}
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isProjectModalOpen && (
          <Modal onClose={() => setIsProjectModalOpen(false)} title="New Project">
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#6a737d] uppercase tracking-widest ml-1">Project Name</label>
                <input type="text" required autoFocus value={projectFormData.name} onChange={e => setProjectFormData({ ...projectFormData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#f9f9fb] border border-[#e1e4e8] text-sm font-bold focus:outline-none focus:border-[#1a1a1b] transition-all" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#1a1a1b] text-white rounded-lg font-bold text-sm shadow-lg hover:bg-black transition-all">Create Project</button>
            </form>
          </Modal>
        )}

        {isSprintModalOpen && (
          <Modal onClose={() => setIsSprintModalOpen(false)} title="Add Sprint">
            <form onSubmit={handleAddSprint} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-[#6a737d] uppercase tracking-widest ml-1">Sprint Name (Optional)</label>
                 <input type="text" value={sprintFormData.name} onChange={e => setSprintFormData({...sprintFormData, name: e.target.value})} placeholder="e.g. Q2 Milestone" className="w-full px-4 py-3 rounded-lg bg-[#f9f9fb] border border-[#e1e4e8] text-sm font-bold focus:outline-none focus:border-[#1a1a1b] transition-all" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-[#6a737d] uppercase tracking-widest ml-1">Due Date</label>
                 <input type="date" required value={sprintFormData.dueDate} onChange={e => setSprintFormData({...sprintFormData, dueDate: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#f9f9fb] border border-[#e1e4e8] text-sm font-bold focus:outline-none focus:border-[#1a1a1b] transition-all" />
               </div>
               <button type="submit" className="w-full py-3 bg-[#1a1a1b] text-white rounded-lg font-bold text-sm shadow-lg hover:bg-black transition-all">Confirm</button>
            </form>
          </Modal>
        )}

        {isTaskModalOpen && (
          <Modal onClose={() => setIsTaskModalOpen(false)} title="New Task">
            {/* Same minimalist form style */}
            <form className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-[#6a737d] uppercase tracking-widest ml-1">Content</label>
                 <textarea rows={3} className="w-full px-4 py-3 rounded-lg bg-[#f9f9fb] border border-[#e1e4e8] text-sm font-bold focus:outline-none" />
               </div>
               <button className="w-full py-3 bg-[#1a1a1b] text-white rounded-lg font-bold text-sm shadow-lg">Add to Board</button>
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-white/60 backdrop-blur-md" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-xl border border-[#e1e4e8] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-lg bg-[#f3f4f6] text-[#6a737d] hover:text-[#1a1a1b]"><X size={18} /></button>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
