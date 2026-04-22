import * as React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Tag,
  Users,
  MoreHorizontal,
  Edit2,
  X,
  ChevronLeft,
  ArrowRight,
  FileText,
  Plus,
  Trash2
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addTask, updateTask, deleteTask, type User } from "@/lib/api";
import { TaskDialog } from "@/components/ui/task-dialog";

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

// Type Definitions for Props
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
};

// Helper component for status badges
const StatusBadge = ({ status }: { status: SubTask["status"] }) => {
  const statusStyles = {
    Completed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-700/60",
    "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/60",
    Pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-700/60",
  };
  return <Badge variant="outline" className={cn("font-medium", statusStyles[status])}>{status}</Badge>;
};



// Helper for live clock
const Clock = () => {
  const [date, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span>
      {date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
      <span className="mx-2">•</span>
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
  onUserUpdated
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
      if (updatedUser && onUserUpdated) {
        onUserUpdated(updatedUser);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleSaveTask = async (taskData: {
    task: string;
    category: string;
    status: string;
    dueDate: string;
  }) => {
    if (!userEmail) return;

    try {
      let updatedUser: User | null = null;

      if (taskDialogMode === "add") {
        updatedUser = await addTask(userEmail, taskData);
      } else if (taskDialogMode === "edit" && editingTask) {
        updatedUser = await updateTask(userEmail, editingTask.id, taskData);
      }

      if (updatedUser && onUserUpdated) {
        onUserUpdated(updatedUser);
      }
      
      setIsTaskDialogOpen(false);
    } catch (error) {
      console.error("Failed to save task:", error);
      throw error; // Re-throw to be handled by TaskDialog
    }
  };

  
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      }
    },
  };

  return (
    <Card className="w-full min-h-screen border-none rounded-none shadow-none bg-background">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Header Section */}
        <CardHeader className="p-4 border-b bg-muted/30">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 hover:bg-muted">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={index}>
                  <span>{breadcrumb.label}</span>
                  {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-4">
                {/* Live Clock */}
                <div className="hidden md:block text-sm font-medium text-muted-foreground tabular-nums">
                   <Clock />
                </div>
                <div className="h-4 w-px bg-border hidden md:block" />
                <div className="flex items-center gap-2">

                <Button variant="ghost" size="icon" onClick={onEdit}><Edit2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={onBack}><X className="h-4 w-4" /></Button>
              </div>
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8 space-y-8">
            {/* Title Section */}
            <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight text-foreground">{title}</motion.h1>

            {/* Meta Info Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start gap-3">
                    <MoreHorizontal className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="w-full max-w-xs">
                        <p className="text-muted-foreground">Status</p>
                        <Badge 
                            variant="outline" 
                            className={cn(
                                "mt-1 font-semibold px-3 py-1.5 backdrop-blur-md shadow-sm transition-all duration-300",
                                status === 'Active' ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]" :
                                status === 'Completed' ? "bg-blue-500/15 text-blue-300 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]" :
                                status === 'On Hold' ? "bg-red-500/15 text-red-300 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]" :
                                status === 'Progress' ? "bg-amber-500/15 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]" :
                                "bg-zinc-500/15 text-zinc-300 border-zinc-500/50 shadow-[0_0_15px_rgba(113,113,122,0.15)]"
                            )}
                        >
                            <span className={cn(
                                "mr-2 h-2.5 w-2.5 rounded-full animate-pulse",
                                status === 'Active' ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" :
                                status === 'Completed' ? "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" :
                                status === 'On Hold' ? "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" :
                                status === 'Progress' ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" :
                                "bg-zinc-400 shadow-[0_0_10px_rgba(161,161,170,0.8)]"
                            )}></span>
                            {status === 'Progress' ? 'In Progress' : status}
                        </Badge>
                        {/* Progress Bar */}
                        <div className="mt-3 space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium text-foreground">{progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <motion.div 
                                    className={cn(
                                        "h-full rounded-full",
                                        progress === 100 ? "bg-green-500" : progress >= 50 ? "bg-primary" : "bg-yellow-500"
                                    )}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Assignee</p>
                        <div className="flex items-center gap-2 mt-1">
                          {assignees.map(assignee => (
                              <div key={assignee.name} className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                                    <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{assignee.name}</span>
                              </div>
                          ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium flex items-center gap-2 mt-1">
                            {dateRange.start} <ArrowRight className="h-4 w-4 text-muted-foreground" /> {dateRange.end}
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Tags</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {tags.map((tag) => <Badge key={tag.label} variant={tag.variant}>{tag.label}</Badge>)}
                        </div>
                    </div>
                </div>
                 <div className="flex items-start gap-3 col-span-1 md:col-span-2">
                    <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Description</p>
                        <p className="mt-1 text-foreground/80">{description}</p>
                    </div>
                </div>
            </motion.div>


            
            {/* Task List Section */}
            <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Task List</h3>
                    <Button onClick={handleAddTask} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Task
                  </Button>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">No</TableHead>
                                <TableHead>Task</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Due Date</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subTasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell className="text-muted-foreground">{task.id}</TableCell>
                                    <TableCell className="font-medium">{task.task}</TableCell>
                                    <TableCell>{task.category}</TableCell>
                                    <TableCell><StatusBadge status={task.status} /></TableCell>
                                    <TableCell className="text-right text-muted-foreground">{task.dueDate}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleEditTask(task)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <TaskDialog
                    isOpen={isTaskDialogOpen}
                    onClose={() => setIsTaskDialogOpen(false)}
                    onSave={handleSaveTask}
                    mode={taskDialogMode}
                    initialData={editingTask || undefined}
                />
            </motion.div>
        </CardContent>
      </motion.div>
    </Card>
  );
}
