"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  MoreHorizontal, 
  Clock, 
  GripVertical,
  Search,
  Filter,
  Trash2,
  Edit2
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KanbanTaskDialog, type KanbanTaskData } from "./kanban-task-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    initials: string;
    avatar?: string;
  };
  dueDate: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const initialMembers = [
  { name: 'MK Admin', initials: 'MK' },
  { name: 'Sonia S.', initials: 'SS' },
  { name: 'Ritesh V.', initials: 'RV' },
  { name: 'Alex J.', initials: 'AJ' },
];

const initialData: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    tasks: [
      { id: '1', title: 'Implement Dark Mode in Dashboard', priority: 'high', assignee: { name: 'MK Admin', initials: 'MK' }, dueDate: 'May 10' },
      { id: '2', title: 'Fix Sidebar Hover Transitions', priority: 'medium', assignee: { name: 'Ritesh V.', initials: 'RV' }, dueDate: 'May 12' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: '3', title: 'Kanban Board Integration', priority: 'high', assignee: { name: 'Sonia S.', initials: 'SS' }, dueDate: 'May 08' },
    ],
  },
  {
    id: 'qa',
    title: 'QA / Testing',
    tasks: [],
  },
  {
    id: 'live',
    title: 'Live',
    tasks: [
      { id: '6', title: 'Initial App Deployment', priority: 'low', assignee: { name: 'MK Admin', initials: 'MK' }, dueDate: 'Apr 28' },
    ],
  },
];

export function ProjectKanban() {
  const [columns, setColumns] = useState<Column[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingTask, setEditingTask] = useState<KanbanTaskData | undefined>(undefined);

  const filteredColumns = useMemo(() => {
    if (!searchQuery) return columns;
    return columns.map(col => ({
      ...col,
      tasks: col.tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }));
  }, [columns, searchQuery]);

  const handleAddTask = () => {
    setDialogMode("add");
    setEditingTask(undefined);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task, columnId: string) => {
    setDialogMode("edit");
    setEditingTask({
      id: task.id,
      title: task.title,
      assignee: task.assignee,
      priority: task.priority,
      dueDate: task.dueDate,
      columnId: columnId
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string, columnId: string) => {
    setColumns(prev => prev.map(col => {
      if (col.id === columnId) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
      }
      return col;
    }));
  };

  const handleSaveTask = (taskData: KanbanTaskData) => {
    if (dialogMode === "add") {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: taskData.title,
        priority: taskData.priority,
        assignee: taskData.assignee,
        dueDate: taskData.dueDate || "No Date",
      };
      setColumns(prev => prev.map(col => {
        if (col.id === taskData.columnId) {
          return { ...col, tasks: [...col.tasks, newTask] };
        }
        return col;
      }));
    } else {
      // Edit logic
      setColumns(prev => {
        // Remove from old column if changed
        let updatedColumns = prev.map(col => ({
          ...col,
          tasks: col.tasks.filter(t => t.id !== taskData.id)
        }));
        // Add to target column
        return updatedColumns.map(col => {
          if (col.id === taskData.columnId) {
            return {
              ...col,
              tasks: [...col.tasks, {
                id: taskData.id!,
                title: taskData.title,
                priority: taskData.priority,
                assignee: taskData.assignee,
                dueDate: taskData.dueDate
              }]
            };
          }
          return col;
        });
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent p-8">
      {/* Kanban Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Project Sprint</h1>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
               Active Sprint: v2.4
             </div>
             <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
               {columns.reduce((acc, col) => acc + col.tasks.length, 0)} Total Tasks
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
             <input 
               type="text" 
               placeholder="Search tasks..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="h-11 w-64 bg-zinc-900/50 border border-white/5 rounded-xl pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all font-bold uppercase tracking-widest"
             />
          </div>
          <Button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-500 text-white h-11 px-6 rounded-xl font-black uppercase tracking-widest text-[11px] gap-3 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" /> New Task
          </Button>
        </div>
      </div>

      {/* Board Layout */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
        {filteredColumns.map((column) => (
          <div key={column.id} className="w-[320px] shrink-0 flex flex-col h-full bg-zinc-900/20 rounded-[32px] border border-white/5 backdrop-blur-3xl overflow-hidden">
            {/* Column Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
               <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    column.id === 'backlog' ? 'bg-zinc-500' :
                    column.id === 'in-progress' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                    column.id === 'qa' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                    'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  )} />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">{column.title}</h3>
                  <span className="text-[10px] font-black text-zinc-600 bg-black/40 px-2 py-0.5 rounded-md">
                    {column.tasks.length}
                  </span>
               </div>
               <button className="p-1.5 text-zinc-600 hover:text-white transition-colors">
                 <MoreHorizontal className="w-4 h-4" />
               </button>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {column.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="p-5 bg-zinc-900/40 border border-white/5 rounded-2xl shadow-xl hover:bg-zinc-900/60 hover:border-blue-500/20 transition-all cursor-pointer group relative"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5",
                      task.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      task.priority === 'medium' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                    )}>
                      {task.priority}
                    </Badge>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleEditTask(task, column.id)} className="p-1 text-zinc-500 hover:text-blue-400"><Edit2 className="w-3.5 h-3.5" /></button>
                       <button onClick={() => handleDeleteTask(task.id, column.id)} className="p-1 text-zinc-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-100 leading-snug mb-5 group-hover:text-blue-400 transition-colors">
                    {task.title}
                  </h4>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                    <div className="flex items-center gap-2">
                       <Avatar className="w-6 h-6 border border-white/5">
                          <AvatarFallback className="text-[8px] bg-blue-600 font-black text-white">{task.assignee.initials}</AvatarFallback>
                       </Avatar>
                       <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tight">{task.assignee.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                       <Clock className="w-3 h-3" />
                       {task.dueDate}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <button 
                onClick={handleAddTask}
                className="w-full py-4 border border-dashed border-white/5 rounded-2xl text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:border-blue-500/20 hover:text-blue-400 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" /> Add Task
              </button>
            </div>
          </div>
        ))}
      </div>

      <KanbanTaskDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveTask}
        mode={dialogMode}
        initialData={editingTask}
        members={initialMembers}
      />
    </div>
  );
}
