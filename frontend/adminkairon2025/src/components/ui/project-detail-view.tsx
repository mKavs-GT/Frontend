import * as React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Tag,
  Users as UsersIcon,
  MoreHorizontal,
  Edit2,
  X,
  ChevronLeft,
  ArrowRight,
  FileText,
  Plus,
  Trash2,
  Palette,
  Type,
  MessageSquare,
  Search,
  Bell,
  CheckCircle2,
  Clock as ClockIcon,
  ChevronRight
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addTask, updateTask, deleteTask, type User } from "@/lib/api";
import { TaskDialog } from "@/components/ui/task-dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Assignee = {
  name: string;
  avatarUrl: string;
};

type ProjectTag = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

type SubTask = {
  id: number;
  task: string;
  category: string;
  status: "Completed" | "In Progress" | "Pending";
  dueDate: string;
};

export type ProjectDetailViewProps = {
  breadcrumbs: { label: string; href: string }[];
  title: string;
  status: string;
  progress?: number;
  assignees: Assignee[];
  dateRange: {
    start: string;
    end: string;
  };
  tags: ProjectTag[];
  description: string;
  subTasks: SubTask[];
  onBack?: () => void;
  onEdit?: () => void;
  userEmail?: string;
  onUserUpdated?: (user: User) => void;
  userData?: User;
};

const StatusBadge = ({ status }: { status: SubTask["status"] }) => {
  const statusStyles = {
    Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Pending: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-transparent",
  };
  return <Badge variant="outline" className={cn("font-black uppercase text-[9px] tracking-widest px-3 py-1", statusStyles[status])}>{status}</Badge>;
};

const Clock = () => {
  const [date, setDate] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="flex items-center gap-2">
      <ClockIcon className="w-3.5 h-3.5 text-primary" />
      {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      <span className="opacity-30">|</span>
      {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
    </span>
  );
};

export function ProjectDetailView({
  breadcrumbs,
  title,
  status,
  progress = 0,
  assignees,
  dateRange,
  tags,
  description,
  subTasks,
  onBack,
  onEdit,
  userEmail,
  onUserUpdated,
  userData
}: ProjectDetailViewProps) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false);
  const [taskDialogMode, setTaskDialogMode] = React.useState<"add" | "edit">("add");
  const [editingTask, setEditingTask] = React.useState<SubTask | null>(null);

  const handleAddTask = () => {
    setTaskDialogMode("add");
    setEditingTask(null);
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: SubTask) => {
    setTaskDialogMode("edit");
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!userEmail) return;
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const updatedUser = await deleteTask(userEmail, taskId);
      if (updatedUser && onUserUpdated) onUserUpdated(updatedUser);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleSaveTask = async (taskData: { task: string; category: string; status: string; dueDate: string }) => {
    if (!userEmail) return;
    try {
      let updatedUser: User | null = null;
      if (taskDialogMode === "add") updatedUser = await addTask(userEmail, taskData);
      else if (taskDialogMode === "edit" && editingTask) updatedUser = await updateTask(userEmail, editingTask.id, taskData);
      if (updatedUser && onUserUpdated) onUserUpdated(updatedUser);
      setIsTaskDialogOpen(false);
    } catch (error) {
      console.error("Failed to save task:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F7FE] dark:bg-zinc-950 transition-colors duration-300">
      {/* Header */}
      <header className="h-[90px] shrink-0 flex items-center justify-between px-8 bg-transparent">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm hover:text-primary transition-all">
             <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[22px] font-black text-zinc-800 dark:text-white tracking-tighter uppercase italic">Project Details</h1>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">
               <Clock />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button onClick={onEdit} className="h-[46px] bg-primary text-primary-foreground px-6 rounded-[14px] text-[12px] font-black uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Info
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-10 scrollbar-hide space-y-8">
        
        {/* Project Hero Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-[30px] p-10 shadow-sm relative overflow-hidden group">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <Badge className={cn(
                    "font-black uppercase text-[10px] tracking-[0.2em] px-4 py-1.5 rounded-full border-none shadow-sm",
                    status === 'Active' ? "bg-emerald-500 text-white" :
                    status === 'Completed' ? "bg-blue-500 text-white" :
                    "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                 )}>
                   {status}
                 </Badge>
                 <span className="text-[11px] font-black text-[#A3AED0] uppercase tracking-widest">{dateRange.start} — {dateRange.end}</span>
              </div>
              <h2 className="text-[36px] font-black text-zinc-800 dark:text-white tracking-tighter uppercase italic leading-none mb-6">
                {title}
              </h2>
              <p className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-10">
                {description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-zinc-50 dark:border-zinc-800">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1">Lead Assignee</span>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-primary-foreground italic">
                         {assignees[0]?.name[0] || 'A'}
                       </div>
                       <span className="text-[13px] font-black text-zinc-800 dark:text-white uppercase italic">{assignees[0]?.name || 'Admin'}</span>
                    </div>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1">Tags</span>
                    <div className="flex flex-wrap gap-2">
                       {tags.map(t => <span key={t.label} className="text-[11px] font-bold text-primary italic lowercase">#{t.label}</span>)}
                    </div>
                 </div>
                 <div className="flex flex-col col-span-2">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">Global Progress</span>
                       <span className="text-[13px] font-black text-primary italic">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-primary" 
                       />
                    </div>
                 </div>
              </div>
           </div>
           {/* Decorative Background Icon */}
           <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:rotate-6 transition-transform duration-700">
              <FileText className="w-[300px] h-[300px]" />
           </div>
        </div>

        {/* Info Grid (User Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Left: Preferences */}
           <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-8 shadow-sm space-y-8">
              <h3 className="text-[16px] font-black text-zinc-800 dark:text-white uppercase italic tracking-widest">Brand DNA</h3>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                       <Palette className="w-4 h-4" />
                       <span className="text-[11px] font-black uppercase tracking-widest">Palettes</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {userData?.favoritePalettes?.map(p => <Badge key={p} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-none px-3">{p}</Badge>)}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                       <Type className="w-4 h-4" />
                       <span className="text-[11px] font-black uppercase tracking-widest">Typography</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {userData?.favoriteFonts?.map(f => <Badge key={f} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-none px-3">{f}</Badge>)}
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Consultation Summary */}
           <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-8 shadow-sm">
              <h3 className="text-[16px] font-black text-zinc-800 dark:text-white uppercase italic tracking-widest mb-6">Engagement History</h3>
              <div className="space-y-4 max-h-[200px] overflow-y-auto scrollbar-hide">
                 {userData?.consultations?.map((c, i) => (
                   <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-[18px] flex items-center justify-between group">
                      <div className="flex flex-col">
                         <span className="text-[13px] font-bold text-zinc-800 dark:text-white italic">{c.plan || "Consultation"}</span>
                         <span className="text-[10px] text-[#A3AED0] uppercase font-black tracking-widest">{new Date(c.timestamp).toLocaleDateString()}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-primary transition-colors" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Task Management Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-8 shadow-sm pb-4">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[18px] font-black text-zinc-800 dark:text-white italic uppercase tracking-tighter">Mission Tasks</h3>
              <Button onClick={handleAddTask} className="h-[38px] bg-primary text-primary-foreground rounded-[10px] text-[11px] font-black uppercase tracking-widest">
                 <Plus className="w-4 h-4 mr-2" />
                 Add New Task
              </Button>
           </div>
           <Table>
              <TableHeader>
                 <TableRow className="border-zinc-50 dark:border-zinc-800 hover:bg-transparent">
                    <TableHead className="font-black text-[10px] text-[#A3AED0] uppercase tracking-widest">Task</TableHead>
                    <TableHead className="font-black text-[10px] text-[#A3AED0] uppercase tracking-widest">Category</TableHead>
                    <TableHead className="font-black text-[10px] text-[#A3AED0] uppercase tracking-widest">Status</TableHead>
                    <TableHead className="font-black text-[10px] text-[#A3AED0] uppercase tracking-widest text-right">Action</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                 {subTasks.map((task) => (
                    <TableRow key={task.id} className="border-zinc-50 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                       <TableCell className="py-5 font-bold text-zinc-800 dark:text-white italic">{task.task}</TableCell>
                       <TableCell className="py-5 text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-widest">{task.category}</TableCell>
                       <TableCell className="py-5"><StatusBadge status={task.status} /></TableCell>
                       <TableCell className="py-5 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => handleEditTask(task)} className="p-2 text-zinc-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                             <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </TableCell>
                    </TableRow>
                 ))}
              </TableBody>
           </Table>
        </div>

      </div>

      <TaskDialog
          isOpen={isTaskDialogOpen}
          onClose={() => setIsTaskDialogOpen(false)}
          onSave={handleSaveTask}
          mode={taskDialogMode}
          initialData={editingTask || undefined}
      />
    </div>
  );
}
