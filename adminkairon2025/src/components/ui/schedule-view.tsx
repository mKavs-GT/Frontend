import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Circle, Trash2, Plus, MessageSquareText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ScheduleItem {
  id: string;
  type: 'call' | 'todo' | 'remark';
  title: string;
  datetime?: string; // for calls
  description?: string;
  completed?: boolean; // for todos
}

const STORAGE_KEY = "mkavs_admin_schedule_v1";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 }
};

export function ScheduleView() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [activeTab, setActiveTab] = useState<'call' | 'todo' | 'remark'>('call');
  
  // Form State
  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse schedule items", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    if (!title.trim()) return;

    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      type: activeTab,
      title: title.trim(),
      description: description.trim(),
      datetime: activeTab === 'call' ? datetime : undefined,
      completed: activeTab === 'todo' ? false : undefined,
    };

    setItems([newItem, ...items]);
    setTitle("");
    setDatetime("");
    setDescription("");
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const toggleTodo = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  };

  const filteredItems = items.filter(i => i.type === activeTab);

  const getTabColor = (tab: string) => {
    switch (tab) {
      case 'call': return 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30';
      case 'todo': return 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30';
      case 'remark': return 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30';
      default: return 'from-zinc-500/20 to-zinc-600/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getTabIconColor = (tab: string) => {
    switch (tab) {
      case 'call': return 'text-blue-500';
      case 'todo': return 'text-amber-500';
      case 'remark': return 'text-rose-500';
      default: return 'text-zinc-500';
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-8 p-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-zinc-800/50 gap-6" variants={itemVariants}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 shadow-lg`}>
            {activeTab === 'call' && <CalendarIcon className="w-8 h-8 text-blue-500" />}
            {activeTab === 'todo' && <CheckCircle2 className="w-8 h-8 text-amber-500" />}
            {activeTab === 'remark' && <MessageSquareText className="w-8 h-8 text-rose-500" />}
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Schedule & Tasks
            </h1>
            <p className="text-zinc-400 mt-1 font-medium italic">
              Manage client calls, to-do lists, and personal remarks.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-zinc-900/60 rounded-xl border border-zinc-800 backdrop-blur-xl">
          {(['call', 'todo', 'remark'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab 
                  ? `bg-gradient-to-r ${getTabColor(tab)} shadow-lg` 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab === 'call' ? 'Calls' : tab === 'todo' ? 'To-Do' : 'Remarks'}
            </button>
          ))}
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-xl shadow-2xl sticky top-8">
             <CardHeader className="border-b border-zinc-800/50 pb-4">
               <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                 <Plus className={`w-5 h-5 ${getTabIconColor(activeTab)}`} />
                 Add New {activeTab === 'call' ? 'Call' : activeTab === 'todo' ? 'Task' : 'Remark'}
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 pt-6">
                <div>
                  <label className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-1.5 block">Title</label>
                  <Input 
                    value={title} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} 
                    placeholder={activeTab === 'call' ? "Client Meeting" : activeTab === 'todo' ? "Review Designs" : "Important Note"} 
                    className="bg-black/40 border-zinc-800 text-white focus:border-zinc-500"
                  />
                </div>
                
                {activeTab === 'call' && (
                  <div>
                    <label className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-1.5 block">Date & Time</label>
                    <Input 
                      type="datetime-local" 
                      value={datetime} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatetime(e.target.value)} 
                      className="bg-black/40 border-zinc-800 text-white focus:border-blue-500 [color-scheme:dark]"
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-1.5 block">Description / Notes</label>
                  <Textarea 
                    value={description} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} 
                    placeholder="Details..." 
                    className="bg-black/40 border-zinc-800 text-white focus:border-zinc-500 min-h-[120px] resize-none"
                  />
                </div>
                
                <Button 
                   onClick={handleAdd} 
                   disabled={!title.trim()}
                   className={`w-full font-bold shadow-lg ${
                     activeTab === 'call' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40' :
                     activeTab === 'todo' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40' :
                     'bg-rose-600 hover:bg-rose-500 shadow-rose-900/40'
                   } text-white transition-all`}
                >
                  Save {activeTab === 'call' ? 'Schedule' : activeTab === 'todo' ? 'Task' : 'Remark'}
                </Button>
             </CardContent>
          </Card>
        </motion.div>

        {/* List Column */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
           {filteredItems.length === 0 ? (
             <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800/50 rounded-2xl">
                {activeTab === 'call' && <CalendarIcon className="w-16 h-16 text-zinc-800 mb-4" />}
                {activeTab === 'todo' && <CheckCircle2 className="w-16 h-16 text-zinc-800 mb-4" />}
                {activeTab === 'remark' && <MessageSquareText className="w-16 h-16 text-zinc-800 mb-4" />}
                <p className="text-xl font-bold text-zinc-600">No {activeTab}s yet</p>
                <p className="text-sm text-zinc-500 mt-2 text-center max-w-sm">Use the form on the left to add items to your personal dashboard.</p>
             </div>
           ) : (
             <AnimatePresence>
                {filteredItems.map(item => (
                  <motion.div key={item.id} variants={itemVariants} initial="hidden" animate="show" exit="exit" layout>
                    <Card className={`group relative overflow-hidden bg-gradient-to-r from-zinc-900/90 to-black border-l-4 backdrop-blur-xl transition-all duration-300 hover:shadow-xl ${
                      activeTab === 'call' ? 'border-l-blue-500 hover:border-r-blue-500/30 border-y-zinc-800 border-r-zinc-800' :
                      activeTab === 'todo' ? `hover:border-r-amber-500/30 border-y-zinc-800 border-r-zinc-800 ${item.completed ? 'border-l-zinc-700 opacity-60' : 'border-l-amber-500'}` :
                      'border-l-rose-500 hover:border-r-rose-500/30 border-y-zinc-800 border-r-zinc-800'
                    }`}>
                       <CardContent className="p-6 flex items-start gap-4">
                          {activeTab === 'todo' && (
                            <button onClick={() => toggleTodo(item.id)} className="mt-1 transition-transform active:scale-90">
                              {item.completed ? 
                                <CheckCircle2 className="w-6 h-6 text-zinc-500" /> : 
                                <Circle className="w-6 h-6 text-amber-500" />
                              }
                            </button>
                          )}
                          
                          <div className={`flex-1 ${item.completed ? 'line-through text-zinc-500' : ''}`}>
                             <div className="flex justify-between items-start mb-2">
                                <h3 className={`text-xl font-bold ${item.completed ? 'text-zinc-500' : 'text-white'}`}>{item.title}</h3>
                                <button 
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 text-zinc-600 hover:text-red-400 bg-zinc-900/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                             
                             {item.datetime && activeTab === 'call' && (
                               <div className="flex items-center gap-2 text-blue-400 font-medium text-sm mb-3 bg-blue-500/10 w-fit px-3 py-1.5 rounded-lg border border-blue-500/20">
                                  <Clock className="w-4 h-4" />
                                  {new Date(item.datetime).toLocaleString()}
                               </div>
                             )}
                             
                             {item.description && (
                               <p className={`text-sm leading-relaxed ${item.completed ? 'text-zinc-600' : 'text-zinc-400'} whitespace-pre-wrap`}>
                                 {item.description}
                               </p>
                             )}
                          </div>
                       </CardContent>
                    </Card>
                  </motion.div>
                ))}
             </AnimatePresence>
           )}
        </motion.div>
      </div>
    </motion.div>
  );
}
