"use client";
import * as React from "react";
import { X, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface KanbanTaskData {
  id?: string;
  title: string;
  assignee: {
    name: string;
    avatar?: string;
    initials: string;
  };
  priority: "low" | "medium" | "high";
  dueDate: string;
  columnId: string;
}

export interface KanbanTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: KanbanTaskData) => void;
  mode: "add" | "edit";
  initialData?: KanbanTaskData;
  members: { name: string; avatar?: string; initials: string }[];
}

export function KanbanTaskDialog({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData,
  members,
}: KanbanTaskDialogProps) {
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [assigneeName, setAssigneeName] = React.useState(initialData?.assignee.name || "");
  const [priority, setPriority] = React.useState<KanbanTaskData["priority"]>(initialData?.priority || "medium");
  const [dueDate, setDueDate] = React.useState(initialData?.dueDate || "");
  const [columnId, setColumnId] = React.useState(initialData?.columnId || "backlog");

  React.useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setAssigneeName(initialData?.assignee.name || members[0]?.name || "");
      setPriority(initialData?.priority || "medium");
      setDueDate(initialData?.dueDate || "");
      setColumnId(initialData?.columnId || "backlog");
    }
  }, [isOpen, initialData, members]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedMember = members.find(m => m.name === assigneeName) || members[0];

    onSave({
      id: initialData?.id,
      title,
      assignee: selectedMember,
      priority,
      dueDate,
      columnId,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight">
            {mode === "add" ? "Create New Task" : "Edit Task Details"}
          </DialogTitle>
          <button onClick={onClose} className="absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-900 border-white/5 text-white placeholder:text-zinc-700 h-12 rounded-xl focus:border-blue-500/50 transition-all font-bold"
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Assign Member</Label>
              <Select value={assigneeName} onValueChange={setAssigneeName}>
                <SelectTrigger className="bg-zinc-900 border-white/5 text-white h-12 rounded-xl focus:border-blue-500/50">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  {members.map((m) => (
                    <SelectItem key={m.name} value={m.name}>
                      <div className="flex items-center gap-2">
                         <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-[8px] bg-blue-600 font-black">{m.initials}</AvatarFallback>
                         </Avatar>
                         <span className="text-xs font-bold">{m.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Priority</Label>
              <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                <SelectTrigger className="bg-zinc-900 border-white/5 text-white h-12 rounded-xl focus:border-blue-500/50 uppercase text-[10px] font-black">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="low" className="text-[10px] font-black uppercase">Low</SelectItem>
                  <SelectItem value="medium" className="text-[10px] font-black uppercase">Medium</SelectItem>
                  <SelectItem value="high" className="text-[10px] font-black uppercase text-red-400">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Section</Label>
              <Select value={columnId} onValueChange={setColumnId}>
                <SelectTrigger className="bg-zinc-900 border-white/5 text-white h-12 rounded-xl focus:border-blue-500/50 uppercase text-[10px] font-black">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="backlog" className="text-[10px] font-black uppercase">Backlog</SelectItem>
                  <SelectItem value="in-progress" className="text-[10px] font-black uppercase">In Progress</SelectItem>
                  <SelectItem value="qa" className="text-[10px] font-black uppercase">QA / Testing</SelectItem>
                  <SelectItem value="live" className="text-[10px] font-black uppercase">Live</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Due Date</Label>
              <Input
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-zinc-900 border-white/5 text-white h-12 rounded-xl focus:border-blue-500/50 font-bold"
                placeholder="e.g. May 20"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
              {mode === "add" ? "Create Task" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
