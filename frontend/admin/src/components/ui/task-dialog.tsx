import * as React from "react";
import { X } from "lucide-react";
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

export interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    task: string;
    category: string;
    status: string;
    dueDate: string;
  }) => Promise<void>;
  mode: "add" | "edit";
  initialData?: {
    id: number;
    task: string;
    category: string;
    status: string;
    dueDate: string;
  };
}

export function TaskDialog({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData,
}: TaskDialogProps) {
  const [task, setTask] = React.useState(initialData?.task || "");
  const [category, setCategory] = React.useState(initialData?.category || "");
  const [status, setStatus] = React.useState(initialData?.status || "Pending");
  const [dueDate, setDueDate] = React.useState(initialData?.dueDate || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Update state when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setTask(initialData.task);
      setCategory(initialData.category);
      setStatus(initialData.status);
      setDueDate(initialData.dueDate);
    } else {
      setTask("");
      setCategory("");
      setStatus("Pending");
      setDueDate("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.trim() || !category.trim() || !dueDate) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({ task, category, status, dueDate });
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
      alert("Failed to save task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Task" : "Edit Task"}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="task">Task Name *</Label>
            <Input
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Meeting, Planning, Execution"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "add" ? "Add Task" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
