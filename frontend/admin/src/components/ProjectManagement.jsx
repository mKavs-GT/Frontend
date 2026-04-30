import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Phone, Building2, MapPin, Briefcase, Calendar, BarChart2, Tag, Paperclip, MessageSquare, CreditCard, Layers, RefreshCw, ChevronRight, Loader2, AlertCircle, Folder, ExternalLink, CheckCircle2, Clock, X, Upload, Trash2 } from 'lucide-react';

const apiBase = () => ['localhost', '127.0.0.1'].includes(window.location.hostname) ? 'http://localhost:3000' : 'https://mkavs-backend.onrender.com';

const STATUS_COLORS = {
  Assigned: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Progress: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  'On Hold': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Completed: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  Unassigned: 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50',
};

function Avatar({ src, name, size = 'md' }) {
  const sz = size === 'lg' ? 'w-16 h-16 text-xl' : size === 'sm' ? 'w-9 h-9 text-xs' : 'w-11 h-11 text-sm';
  const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['from-indigo-500 to-purple-600', 'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600'];
  const color = colors[(name || '').charCodeAt(0) % colors.length];
  if (src) return <img src={src.startsWith('http') ? src : `${apiBase()}${src}`} alt={name} className={`${sz} rounded-2xl object-cover ring-2 ring-zinc-800`} />;
  return <div className={`${sz} rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white ring-2 ring-zinc-800`}>{initials}</div>;
}

function Badge({ status }) {
  return <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${STATUS_COLORS[status] || STATUS_COLORS.Unassigned}`}>{status}</span>;
}

function ProgressBar({ value = 0 }) {
  return (
    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-zinc-800/60 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-zinc-800/80 flex items-center justify-center flex-shrink-0"><Icon size={13} className="text-zinc-400" /></div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-medium text-zinc-200 truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}

const TABS = ['Overview', 'Project', 'Schedule', 'Billing', 'Messages', 'Assets'];

export default function ProjectManagement({ user }) {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [search, setSearch] = useState('');

  const updateClientLocally = (email, updater) => {
    setClients(prev => prev.map(c => c.email === email ? updater(c) : c));
    setSelected(prev => prev?.email === email ? updater(prev) : prev);
  };

  const authHeader = user?.token ? { Authorization: `Bearer ${user.token}` } : {};

  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [uRes, pRes] = await Promise.all([
        fetch(`${apiBase()}/api/admin/users`, { credentials: 'include', headers: authHeader }),
        fetch(`${apiBase()}/api/projects`, { credentials: 'include', headers: authHeader }),
      ]);
      const usersData = await uRes.json();
      const projectsData = await pRes.json();
      
      if (!uRes.ok) throw new Error(usersData.error || 'Failed to load users');
      if (!pRes.ok) throw new Error(projectsData.error || 'Failed to load projects');
      
      const users = Array.isArray(usersData) ? usersData : (usersData.users || []);
      const proj = projectsData.projects || [];
      
      const assigned = users.filter(u => ['Assigned', 'Active'].includes(u.adminData?.projectStatus));
      setClients(assigned);
      setProjects(proj);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const getProject = (client) => projects.find(p => p.userId === client._id || p.userId?._id === client._id);

  const filtered = clients.filter(c => {
    const name = (c.displayName || c.username || '').toLowerCase();
    return name.includes(search.toLowerCase()) || (c.email || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5"><Layers size={20} className="text-indigo-400" />Project Management</h2>
          <p className="text-sm text-zinc-500 mt-1">Assigned clients and their project workspaces.</p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-zinc-600" /></div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-500"><AlertCircle size={32} className="text-rose-500" /><p className="text-sm">{error}</p></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">

          {/* Client List */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="relative">
              <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors" />
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto pr-1 hide-scrollbar flex-1">
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-zinc-600 gap-2"><Folder size={32} /><p className="text-sm font-medium">No assigned clients</p></div>
              )}
              {filtered.map(client => {
                const proj = getProject(client);
                const isActive = selected?._id === client._id;
                return (
                  <motion.button key={client._id} onClick={() => { setSelected(client); setActiveTab('Overview'); }}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all group ${isActive ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-zinc-900/60 border-zinc-800/60 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-3">
                      <Avatar src={client.image} name={client.displayName || client.username} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-sm text-white truncate">{client.displayName || client.username || 'Unknown'}</p>
                          <Badge status={client.adminData?.projectStatus || 'Assigned'} />
                        </div>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{client.email}</p>
                        {proj && <ProgressBar value={proj.adminData?.projectProgress || 0} />}
                      </div>
                      <ChevronRight size={14} className={`flex-shrink-0 text-zinc-600 transition-colors ${isActive ? 'text-indigo-400' : 'group-hover:text-zinc-400'}`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-3 bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-zinc-800/60 flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {!selected ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-3">
                  <Users size={48} /><p className="text-sm font-bold uppercase tracking-widest">Select a client</p>
                </motion.div>
              ) : (
                <motion.div key={selected._id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex flex-col h-full">
                  {/* Header */}
                  <div className="px-7 pt-6 pb-5 border-b border-zinc-800/60">
                    <div className="flex items-start gap-4">
                      <Avatar src={selected.image} name={selected.displayName || selected.username} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-white">{selected.displayName || selected.username}</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">{selected.jobTitle}{selected.company ? ` · ${selected.company}` : ''}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge status={selected.adminData?.projectStatus || 'Assigned'} />
                            <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><X size={14} /></button>
                          </div>
                        </div>
                        {/* Tab nav */}
                        <div className="flex gap-1 mt-4 bg-zinc-950/50 rounded-xl p-1">
                          {TABS.map(t => (
                            <button key={t} onClick={() => setActiveTab(t)}
                              className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto px-7 py-5 hide-scrollbar">
                    <AnimatePresence mode="wait">
                      {activeTab === 'Overview' && <OverviewTab key="o" client={selected} />}
                      {activeTab === 'Project' && <ProjectTab key="p" client={selected} project={getProject(selected)} />}
                      {activeTab === 'Schedule' && <ScheduleTab key="s" client={selected} authHeader={authHeader} onUpdate={updateClientLocally} />}
                      {activeTab === 'Billing' && <BillingTab key="b" client={selected} />}
                      {activeTab === 'Messages' && <MessagesTab key="m" client={selected} />}
                      {activeTab === 'Assets' && <AssetsTab key="a" client={selected} authHeader={authHeader} onUpdate={updateClientLocally} />}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

function TabPanel({ children }) {
  return <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">{children}</motion.div>;
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-zinc-950/50 rounded-2xl p-5 border border-zinc-800/50">
      {title && <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-1.5"><Icon size={11} />{title}</p>}
      {children}
    </div>
  );
}

function OverviewTab({ client }) {
  const ad = client.adminData || {};
  return (
    <TabPanel>
      <Section title="Contact Information" icon={Mail}>
        <InfoRow icon={Mail} label="Email" value={client.email} />
        <InfoRow icon={Phone} label="Phone" value={client.phone} />
        <InfoRow icon={Building2} label="Company" value={client.company} />
        <InfoRow icon={Briefcase} label="Job Title" value={client.jobTitle} />
        <InfoRow icon={MapPin} label="Country" value={client.country} />
      </Section>
      {(ad.deliverables?.length > 0) && (
        <Section title="Deliverables" icon={Paperclip}>
          <div className="flex flex-col gap-2">
            {ad.deliverables.map((d, i) => (
              <a key={i} href={d.link} target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/40 transition-all group">
                <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{d.title}</span>
                <ExternalLink size={13} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
              </a>
            ))}
          </div>
        </Section>
      )}
      {client.consultations?.length > 0 && (
        <Section title="Consultations" icon={MessageSquare}>
          <div className="flex flex-col gap-2">
            {client.consultations.slice(0, 3).map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{c.tier || 'General'}</span>
                  <span className="text-[10px] text-zinc-500">{c.date ? new Date(c.date).toLocaleDateString() : ''}</span>
                </div>
                <p className="text-sm text-zinc-300">{c.description || c.message || 'No details'}</p>
                {c.preference && <p className="text-xs text-zinc-500 mt-1">Preference: {c.preference}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </TabPanel>
  );
}

function ProjectTab({ client, project }) {
  const ad = project?.adminData || client?.adminData || {};
  const progress = ad.projectProgress || 0;
  if (!project) return (
    <TabPanel><div className="flex flex-col items-center justify-center py-12 text-zinc-600 gap-3"><Folder size={36} /><p className="text-sm">No project workspace yet.</p></div></TabPanel>
  );
  return (
    <TabPanel>
      <div className="grid grid-cols-2 gap-3">
        <Section title="Progress" icon={BarChart2}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg width={64} height={64} className="rotate-[-90deg]">
                <circle cx={32} cy={32} r={26} fill="none" stroke="currentColor" strokeWidth={5} className="text-zinc-800" />
                <motion.circle cx={32} cy={32} r={26} fill="none" stroke="url(#g2)" strokeWidth={5} strokeLinecap="round"
                  strokeDasharray={163} initial={{ strokeDashoffset: 163 }} animate={{ strokeDashoffset: 163 - (progress / 100) * 163 }} transition={{ duration: 1 }} />
                <defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{progress}%</span>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{progress}%</p>
              <p className="text-xs text-zinc-500">Complete</p>
            </div>
          </div>
        </Section>
        <Section title="Status" icon={Tag}>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border ${STATUS_COLORS[ad.projectStatus] || STATUS_COLORS.Active}`}>{ad.projectStatus || 'Active'}</span>
          {ad.projectStartDate && <p className="text-xs text-zinc-500 mt-3">Start: <span className="text-zinc-300">{ad.projectStartDate}</span></p>}
          {ad.projectEndDate && <p className="text-xs text-zinc-500 mt-1">End: <span className="text-zinc-300">{ad.projectEndDate}</span></p>}
        </Section>
      </div>
      {ad.projectDescription && (
        <Section title="Description" icon={Folder}>
          <p className="text-sm text-zinc-300 leading-relaxed">{ad.projectDescription}</p>
        </Section>
      )}
      {ad.projectTags?.length > 0 && (
        <Section title="Tags" icon={Tag}>
          <div className="flex flex-wrap gap-2">
            {ad.projectTags.map(t => <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{t}</span>)}
          </div>
        </Section>
      )}
      {ad.tasks?.length > 0 && (
        <Section title="Tasks" icon={CheckCircle2}>
          <div className="flex flex-col gap-2">
            {ad.tasks.map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.status === 'Completed' ? 'bg-emerald-500' : t.status === 'In Progress' ? 'bg-indigo-500' : 'bg-zinc-600'}`} />
                <p className="text-sm text-zinc-300 flex-1 truncate">{t.task}</p>
                <span className="text-[10px] text-zinc-500 flex-shrink-0">{t.dueDate}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </TabPanel>
  );
}

function ScheduleTab({ client, authHeader, onUpdate }) {
  const meetings = client.adminData?.meetings || [];
  const upcoming = meetings.filter(m => m.status === 'Upcoming');
  const past = meetings.filter(m => m.status !== 'Upcoming');

  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '', link: '' });

  const saveMeetings = async (newMeetings) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase()}/api/admin/user/${encodeURIComponent(client.email)}`, {
        method: 'PUT',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ adminData: { meetings: newMeetings } })
      });
      if (res.ok) {
        onUpdate(client.email, c => ({ ...c, adminData: { ...c.adminData, meetings: newMeetings } }));
        setIsAdding(false);
        setForm({ title: '', date: '', time: '', link: '' });
      }
    } catch (err) {
      console.error('Failed to save meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    saveMeetings([{ ...form, status: 'Upcoming' }, ...meetings]);
  };

  const handleDelete = (index) => {
    const updated = [...meetings];
    updated.splice(index, 1);
    saveMeetings(updated);
  };

  const handleStatus = (index, newStatus) => {
    const updated = [...meetings];
    updated[index].status = newStatus;
    saveMeetings(updated);
  };

  // Helper to find original index of a meeting in the full array
  const getOriginalIndex = (meeting) => meetings.indexOf(meeting);

  return (
    <TabPanel>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Calendar className="text-indigo-400" size={18} /> Scheduling</h3>
        <button onClick={() => setIsAdding(!isAdding)} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold transition-colors">
          {isAdding ? 'Cancel' : '+ New Meeting'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6" onSubmit={handleAdd}>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Meeting Title</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Project Kickoff"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Date</label>
                  <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Time</label>
                  <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 [color-scheme:dark]" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Location / Meeting Link</label>
                <input value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://zoom.us/j/..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50" />
              </div>
              <button disabled={loading} type="submit" className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center">
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Schedule Meeting'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <Section title="Upcoming Meetings" icon={Calendar}>
        {upcoming.length === 0 ? <p className="text-sm text-zinc-600 italic">No upcoming meetings.</p> : (
          <div className="flex flex-col gap-2">
            {upcoming.map((m, i) => {
              const oIndex = getOriginalIndex(m);
              return (
                <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center flex-shrink-0"><Calendar size={16} className="text-indigo-400" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white">{m.title}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{new Date(m.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} {m.time && `at ${m.time}`}</p>
                      {m.link && <a href={m.link} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-400 hover:text-indigo-300 mt-1.5 inline-flex items-center gap-1"><ExternalLink size={10} /> Join Meeting</a>}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t border-zinc-800/50 pt-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleStatus(oIndex, 'Completed')} className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors">Complete</button>
                    <button onClick={() => handleStatus(oIndex, 'Cancelled')} className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white text-xs font-bold transition-colors">Cancel</button>
                    <button onClick={() => handleDelete(oIndex)} className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {past.length > 0 && (
        <Section title="Past Meetings" icon={Clock}>
          <div className="flex flex-col gap-2">
            {past.map((m, i) => {
              const oIndex = getOriginalIndex(m);
              return (
                <div key={i} className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/50 flex flex-col gap-2 group">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${m.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>{m.status}</span>
                    <p className="text-sm font-medium text-zinc-400 truncate">{m.title}</p>
                    <p className="text-xs text-zinc-600 ml-auto flex-shrink-0">{new Date(m.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleDelete(oIndex)} className="text-xs font-bold text-rose-400/70 hover:text-rose-400 transition-colors">Delete Record</button>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </TabPanel>
  );
}

function BillingTab({ client }) {
  const ad = client.adminData || {};
  const sub = ad.subscription || {};
  const invoices = ad.invoices || [];
  return (
    <TabPanel>
      {(sub.planName || sub.price) && (
        <Section title="Subscription Plan" icon={CreditCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg text-white">{sub.planName || 'Custom Plan'}</p>
              {sub.nextBilling && <p className="text-xs text-zinc-500 mt-1">Next billing: {sub.nextBilling}</p>}
            </div>
            {sub.price && <span className="text-2xl font-black text-indigo-400">{sub.price}</span>}
          </div>
        </Section>
      )}
      {invoices.length > 0 && (
        <Section title="Invoice History" icon={CreditCard}>
          <div className="flex flex-col gap-2">
            {invoices.map((inv, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{inv.description}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{inv.date}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{inv.status}</span>
                <span className="text-sm font-bold text-white ml-2">{inv.amount}</span>
                {inv.link && <a href={inv.link} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-indigo-400 transition-colors"><ExternalLink size={13} /></a>}
              </div>
            ))}
          </div>
        </Section>
      )}
      {!sub.planName && invoices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-600 gap-2"><CreditCard size={32} /><p className="text-sm">No billing info yet.</p></div>
      )}
    </TabPanel>
  );
}

function MessagesTab({ client }) {
  const messages = (client.adminData?.messages || []).slice().reverse();
  return (
    <TabPanel>
      <Section title="Admin Messages" icon={MessageSquare}>
        {messages.length === 0 ? <p className="text-sm text-zinc-600 italic">No messages yet.</p> : (
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`p-4 rounded-2xl border ${msg.isRead ? 'bg-zinc-900/50 border-zinc-800/50 opacity-70' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-400">{msg.sender || 'System Admin'}</span>
                  <div className="flex items-center gap-2">
                    {!msg.isRead && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                    <span className="text-[10px] text-zinc-600">{msg.date ? new Date(msg.date).toLocaleDateString() : ''}</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </Section>
    </TabPanel>
  );
}

function AssetsTab({ client, authHeader, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef(null);
  const ad = client?.adminData || {};
  const attachments = ad.attachments || [];
  const deliverables = ad.deliverables || [];
  const palettes = client?.favoritePalettes || [];
  const fonts = client?.favoriteFonts || [];
  const [isAddingDeliverable, setIsAddingDeliverable] = useState(false);
  const [deliverableForm, setDeliverableForm] = useState({ title: '', link: '' });
  const [deliverableFile, setDeliverableFile] = useState(null);
  const [savingDeliverable, setSavingDeliverable] = useState(false);

  const handleAddDeliverable = async (e) => {
    e.preventDefault();
    if (!deliverableForm.title) return;
    if (!deliverableForm.link && !deliverableFile) return;
    
    setSavingDeliverable(true);
    let finalLink = deliverableForm.link;

    if (deliverableFile) {
      const fd = new FormData();
      fd.append('file', deliverableFile);
      try {
        const res = await fetch(`${apiBase()}/api/admin/user/${encodeURIComponent(client.email)}/upload`, {
          method: 'POST', headers: authHeader, credentials: 'include', body: fd,
        });
        const data = await res.json();
        if (res.ok && data.attachment) {
          finalLink = apiBase() + data.attachment.path;
          onUpdate(client.email, c => ({
            ...c,
            adminData: { ...c.adminData, attachments: [...(c.adminData?.attachments || []), data.attachment] }
          }));
        }
      } catch (err) {
        console.error('File upload failed', err);
        setSavingDeliverable(false);
        return;
      }
    }

    const newDeliverables = [{ title: deliverableForm.title, link: finalLink, uploadDate: new Date() }, ...deliverables];
    
    try {
      const res = await fetch(`${apiBase()}/api/admin/user/${encodeURIComponent(client.email)}`, {
        method: 'PUT',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ adminData: { deliverables: newDeliverables } })
      });
      if (res.ok) {
        onUpdate(client.email, c => ({ ...c, adminData: { ...c.adminData, deliverables: newDeliverables } }));
        setIsAddingDeliverable(false);
        setDeliverableForm({ title: '', link: '' });
        setDeliverableFile(null);
      }
    } catch (err) {
      console.error('Failed to save deliverables:', err);
    } finally {
      setSavingDeliverable(false);
    }
  };

  const handleDeleteDeliverable = async (index) => {
    const updated = [...deliverables];
    updated.splice(index, 1);
    
    try {
      const res = await fetch(`${apiBase()}/api/admin/user/${encodeURIComponent(client.email)}`, {
        method: 'PUT',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ adminData: { deliverables: updated } })
      });
      if (res.ok) {
        onUpdate(client.email, c => ({ ...c, adminData: { ...c.adminData, deliverables: updated } }));
      }
    } catch (err) {
      console.error('Failed to delete deliverable:', err);
    }
  };

  const doUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    const results = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch(`${apiBase()}/api/admin/user/${encodeURIComponent(client.email)}/upload`, {
          method: 'POST', headers: authHeader, credentials: 'include', body: fd,
        });
        const data = await res.json();
        if (res.ok && data.attachment) results.push(data.attachment);
      } catch { /* noop */ }
    }
    if (results.length) {
      onUpdate(client.email, c => ({
        ...c,
        adminData: { ...c.adminData, attachments: [...(c.adminData?.attachments || []), ...results] }
      }));
    }
    setUploading(false);
  };

  const doDelete = async (att) => {
    setDeleteId(att.path);
    try {
      await fetch(`${apiBase()}/api/admin/user/${encodeURIComponent(client.email)}/attachment`, {
        method: 'DELETE', headers: { ...authHeader, 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ filePath: att.path }),
      });
      onUpdate(client.email, c => ({
        ...c,
        adminData: { ...c.adminData, attachments: (c.adminData?.attachments || []).filter(a => a.path !== att.path) }
      }));
    } finally { setDeleteId(null); }
  };

  const getIcon = (name = '') => {
    if (!name) return '📎';
    try {
      const ext = String(name).split('.').pop().toLowerCase();
      if (['jpg','jpeg','png','gif','webp','svg'].includes(ext)) return '🖼️';
      if (['pdf'].includes(ext)) return '📄';
      if (['zip','rar','7z'].includes(ext)) return '🗜️';
      if (['mp4','mov','avi'].includes(ext)) return '🎬';
      if (['doc','docx'].includes(ext)) return '📝';
    } catch(e) {}
    return '📎';
  };

  return (
    <TabPanel>
      {/* Deliverables Hub */}
      <div className="bg-zinc-950/50 rounded-2xl border border-zinc-800/50 overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-zinc-800/60 flex items-center justify-between">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Folder size={10} />Deliverables Hub</p>
          <button onClick={() => setIsAddingDeliverable(!isAddingDeliverable)} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-[10px] font-bold transition-colors">
            {isAddingDeliverable ? 'Cancel' : '+ Add Link'}
          </button>
        </div>

        <AnimatePresence>
          {isAddingDeliverable && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-b border-zinc-800/60 bg-zinc-900/30" onSubmit={handleAddDeliverable}>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Deliverable Title</label>
                  <input required value={deliverableForm.title} onChange={e => setDeliverableForm({...deliverableForm, title: e.target.value})} placeholder="e.g., Final Logo Package"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Download Link / URL</label>
                    <input disabled={!!deliverableFile} value={deliverableForm.link} onChange={e => setDeliverableForm({...deliverableForm, link: e.target.value})} placeholder="https://..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50" />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 text-center">OR UPLOAD LOCALLY</label>
                    <label className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-center cursor-pointer transition-colors truncate">
                      {deliverableFile ? deliverableFile.name : 'Choose File...'}
                      <input type="file" className="hidden" onChange={e => {
                        setDeliverableFile(e.target.files[0] || null);
                        if (e.target.files[0]) setDeliverableForm({...deliverableForm, link: ''});
                      }} />
                    </label>
                  </div>
                </div>
                <button disabled={savingDeliverable || (!deliverableForm.link && !deliverableFile)} type="submit" className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center">
                  {savingDeliverable ? <Loader2 size={14} className="animate-spin" /> : 'Add Deliverable'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {deliverables.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-zinc-600 gap-2 text-xs italic"><Folder size={16} /><span>No deliverables uploaded yet</span></div>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-800/40">
            {deliverables.map((d, i) => d ? (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-900/40 transition-colors group">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0"><Paperclip size={13} className="text-indigo-400" /></div>
                <div className="flex-1 min-w-0">
                  <a href={d.link} target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors truncate block">{d.title || 'Deliverable'}</a>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={d.link} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-indigo-400 transition-colors"><ExternalLink size={12} /></a>
                  <button onClick={() => handleDeleteDeliverable(i)} className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ) : null)}
          </div>
        )}
      </div>

      {palettes.length > 0 && (
        <div className="bg-zinc-950/50 rounded-2xl border border-zinc-800/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-800/60">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">🎨 Favorite Palettes</p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {palettes.map((p, i) => p ? (
              <div key={i} className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <div className="flex h-10">
                  {(p.colors || []).slice(0, 5).map((c, ci) => (
                    <div key={ci} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="text-[11px] font-semibold text-zinc-300 px-2.5 py-2 truncate">{p.name || `Palette ${i + 1}`}</p>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      {fonts.length > 0 && (
        <div className="bg-zinc-950/50 rounded-2xl border border-zinc-800/50 overflow-hidden mt-6">
          <div className="px-5 py-3 border-b border-zinc-800/60">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">🔤 Favorite Fonts</p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {fonts.map((f, i) => f ? (
              <div key={i} className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-col">
                <div className="h-20 flex items-center justify-center bg-zinc-950/50 overflow-hidden relative group">
                  <span className="text-4xl font-normal text-zinc-300" style={{ fontFamily: f.family || f.name || 'sans-serif' }}>Aa</span>
                </div>
                <div className="p-3 border-t border-zinc-800 flex flex-col">
                  <p className="text-xs font-bold text-white truncate">{f.name}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5 capitalize">{f.category || 'Typography'}</p>
                </div>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      <motion.div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); doUpload(e.dataTransfer.files); }}
        onClick={() => !uploading && fileRef.current?.click()}
        animate={{ borderColor: dragOver ? 'rgba(99,102,241,0.6)' : 'rgba(63,63,70,0.5)', backgroundColor: dragOver ? 'rgba(99,102,241,0.05)' : 'rgba(9,9,11,0.4)' }}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer group mt-6"
      >
        <input ref={fileRef} type="file" multiple className="hidden" onChange={e => doUpload(e.target.files)} />
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${dragOver ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-500 group-hover:bg-indigo-500/10 group-hover:text-indigo-400'}`}>
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-zinc-300">{uploading ? 'Uploading…' : dragOver ? 'Drop files here' : 'Upload Reference Files'}</p>
          <p className="text-xs text-zinc-600 mt-1">Any type · Max 50MB</p>
        </div>
      </motion.div>

      {attachments.length > 0 && (
        <div className="bg-zinc-950/50 rounded-2xl border border-zinc-800/50 overflow-hidden mt-6">
          <div className="px-5 py-3 border-b border-zinc-800/60">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Paperclip size={10} />Uploaded Reference Files ({attachments.length})</p>
          </div>
          <div className="flex flex-col divide-y divide-zinc-800/40">
            {attachments.map((att, i) => att ? (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-900/40 transition-colors group">
                <span className="text-xl flex-shrink-0">{getIcon(att.name)}</span>
                <div className="flex-1 min-w-0">
                  <a href={`${apiBase()}${att.path}`} target="_blank" rel="noreferrer"
                    className="text-sm font-medium text-zinc-200 hover:text-indigo-400 transition-colors truncate block">{att.name || 'File'}</a>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{att.size} · {att.uploadDate ? new Date(att.uploadDate).toLocaleDateString() : ''}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={att.path ? `${apiBase()}${att.path}` : '#'} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-indigo-400 transition-colors"><ExternalLink size={12} /></a>
                  <button onClick={() => doDelete(att)} disabled={deleteId === att.path} className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors disabled:opacity-40">
                    {deleteId === att.path ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </button>
                </div>
              </motion.div>
            ) : null)}
          </div>
        </div>
      )}
    </TabPanel>
  );
}
