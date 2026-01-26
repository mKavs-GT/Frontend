
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Project, type User } from "@/lib/api";

interface EditProjectDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | User | null;
  onSave: (id: string, updatedData: Partial<User> | Record<string, unknown>) => Promise<void>;
}

// Input sanitization helper
const sanitizeInput = (value: string, maxLength: number = 100): string => {
  return value.trim().replace(/[<>]/g, '').substring(0, maxLength);
};

export function EditProjectDataDialog({ isOpen, onClose, project, onSave }: EditProjectDataDialogProps) {
  // Form state
  const [name, setName] = useState("");
  const [repository, setRepository] = useState("");
  const [team, setTeam] = useState("");
  const [tech, setTech] = useState("");
  const [status, setStatus] = useState<Project["status"]>("Active");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && project) {
      // Check if it's a User object (has adminData) or Project object
      const isUser = 'adminData' in project;
      
      if (isUser) {
        const user = project as User;
        setName(user.adminData?.activeProjects || "");
        setRepository(""); // Users don't have repo field in adminData currently
        setTeam(user.displayName || "");
        setTech(""); // Users don't have tech field in adminData currently
        setStatus(user.adminData?.projectStatus || "Active");
      } else {
        const proj = project as Project;
        setName(proj.name || "");
        setRepository(proj.repository || "");
        setTeam(proj.team || "");
        setTech(proj.tech || "");
        setStatus(proj.status || "Active");
      }
      
      setError(null);
      setSuccess(false);
    }
  }, [project, isOpen]);

  const validateForm = (): string | null => {
    if (!name.trim()) return "Project name is required";
    if (!repository.trim() || !repository.match(/^https?:\/\/.+/)) return "Valid repository URL is required";
    if (!team.trim()) return "Team name is required";
    if (!tech.trim()) return "Technology stack is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    
    setError(null);
    setSuccess(false);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);
    try {
      const isUser = 'adminData' in project;
      
      let updatedData: Partial<User> | Record<string, unknown>;
      
      if (isUser) {
          // Construct User update
          updatedData = {
              displayName: team, // Using Team field as Display Name
              adminData: {
                  ...((project as User).adminData || {}),
                  activeProjects: name,
                  projectStatus: status
              }
          };
      } else {
          // Construct Project update
          updatedData = {
            name: sanitizeInput(name, 200),
            repository: repository.trim(),
            team: sanitizeInput(team, 100),
            tech: sanitizeInput(tech, 100),
            status: status as string
          };
      }
      
      const idOrEmail = isUser ? (project as User).email : project._id;
      await onSave(idOrEmail, updatedData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg"
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">Edit Database Project</h2>
              <p className="text-sm text-muted-foreground">
                Update the project information in the MongoDB database.
              </p>
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
              >
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Database updated successfully!</span>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">Project Name</label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="repo" className="text-right text-sm font-medium">Repository</label>
                <Input id="repo" value={repository} onChange={(e) => setRepository(e.target.value)} className="col-span-3" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="team" className="text-right text-sm font-medium">Team</label>
                <Input id="team" value={team} onChange={(e) => setTeam(e.target.value)} className="col-span-3" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="tech" className="text-right text-sm font-medium">Tech Stack</label>
                <Input id="tech" value={tech} onChange={(e) => setTech(e.target.value)} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right text-sm font-medium">Status</label>
                <div className="col-span-3">
                  <Select value={status} onValueChange={(val: Project["status"]) => setStatus(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Progress">Progress</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                <Button type="submit" disabled={isLoading || success}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {success ? "Saved!" : "Update Project"}
                </Button>
              </div>
            </form>
            
            <button onClick={onClose} className="absolute right-4 top-4 opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
