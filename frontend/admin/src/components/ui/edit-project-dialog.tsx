import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type User } from "@/lib/api";

interface EditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedData: Partial<User>) => Promise<void>;
}

// Input sanitization helper
const sanitizeInput = (value: string, maxLength: number = 100): string => {
  return value.trim().replace(/[<>]/g, '').substring(0, maxLength);
};

// Phone sanitization - only allow numbers, spaces, dashes, plus, parentheses
const sanitizePhone = (value: string): string => {
  return value.replace(/[^\d\s\-+()]/g, '').substring(0, 20);
};

export function EditProjectDialog({ isOpen, onClose, user, onSave }: EditProjectDialogProps) {
  // Form state
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectProgress, setProjectProgress] = useState(0);
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectTags, setProjectTags] = useState("");
  const [projectStatus, setProjectStatus] = useState<string>("Active");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      setDisplayName(user.displayName || "");
      setPhone(user.phone || "");
      setCountry(user.country || "");
      setProjectName(user.adminData?.activeProjects || "");
      setProjectProgress(user.adminData?.projectProgress || 0);
      setProjectDescription(user.adminData?.projectDescription || "");
      setProjectStartDate(user.adminData?.projectStartDate || "");
      setProjectEndDate(user.adminData?.projectEndDate || "");
      setProjectTags(user.adminData?.projectTags?.join(", ") || "");
      setProjectStatus(user.adminData?.projectStatus || "Active");
      setError(null);
      setSuccess(false);
    }
  }, [user, isOpen]);

  // Validate form before submission
  const validateForm = (): string | null => {
    if (!displayName.trim()) {
      return "Name is required";
    }
    if (displayName.length > 100) {
      return "Name must be under 100 characters";
    }
    if (phone && phone.length > 20) {
      return "Phone must be under 20 characters";
    }
    if (country.length > 100) {
      return "Country must be under 100 characters";
    }
    if (projectName.length > 200) {
      return "Project name must be under 200 characters";
    }
    if (projectProgress < 0 || projectProgress > 100) {
      return "Progress must be between 0 and 100";
    }
    if (projectDescription.length > 1000) {
      return "Description must be under 1000 characters";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    // Validate inputs
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);
    try {
      const updatedData: Partial<User> = {
        displayName: sanitizeInput(displayName, 100),
        phone: sanitizePhone(phone),
        country: sanitizeInput(country, 100),
        adminData: {
          ...(user.adminData || {}),
          activeProjects: sanitizeInput(projectName, 200),
          projectProgress: Math.min(100, Math.max(0, Math.round(Number(projectProgress)))),
          projectDescription: sanitizeInput(projectDescription, 1000),
          projectStartDate: sanitizeInput(projectStartDate, 50),
          projectEndDate: sanitizeInput(projectEndDate, 50),
          projectTags: projectTags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
          projectStatus: projectStatus as string,
        }
      };
      await onSave(updatedData);
      setSuccess(true);
      // Close after a brief success message
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save changes";
      setError(errorMessage);
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
              <h2 className="text-lg font-semibold leading-none tracking-tight">Edit Project Details</h2>
              <p className="text-sm text-muted-foreground">
                Make changes to the client and project information here. Click save when you&apos;re done.
              </p>
            </div>
            
            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Alert */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                >
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Changes saved successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="col-span-3"
                  maxLength={100}
                  required
                  aria-required="true"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                  className="col-span-3"
                  maxLength={20}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="country" className="text-right text-sm font-medium">
                  Country
                </label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="col-span-3"
                  maxLength={100}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="project" className="text-right text-sm font-medium">
                  Project Name
                </label>
                <Input
                  id="project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="col-span-3"
                  maxLength={200}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="progress" className="text-right text-sm font-medium">
                  Progress (%)
                </label>
                <div className="col-span-3 space-y-4">
                  {/* Progress Header with Slider and Bar alignment */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <span>Live Progress</span>
                      <span className="text-primary tabular-nums">{projectProgress}%</span>
                    </div>
                    
                    {/* Slider */}
                    <div className="relative flex items-center h-6">
                      <input
                        id="progress"
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={projectProgress}
                        onChange={(e) => setProjectProgress(Number(e.target.value))}
                        className="w-full h-2.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary
                          [&::-webkit-slider-thumb]:appearance-none 
                          [&::-webkit-slider-thumb]:w-5 
                          [&::-webkit-slider-thumb]:h-5 
                          [&::-webkit-slider-thumb]:rounded-full 
                          [&::-webkit-slider-thumb]:bg-primary 
                          [&::-webkit-slider-thumb]:border-2
                          [&::-webkit-slider-thumb]:border-background
                          [&::-webkit-slider-thumb]:cursor-grab
                          [&::-webkit-slider-thumb]:active:cursor-grabbing
                          [&::-webkit-slider-thumb]:shadow-lg
                          [&::-webkit-slider-thumb]:transition-transform
                          [&::-webkit-slider-thumb]:hover:scale-110
                          [&::-moz-range-thumb]:w-5 
                          [&::-moz-range-thumb]:h-5 
                          [&::-moz-range-thumb]:rounded-full 
                          [&::-moz-range-thumb]:bg-primary 
                          [&::-moz-range-thumb]:border-2
                          [&::-moz-range-thumb]:border-background
                          [&::-moz-range-thumb]:cursor-grab
                          [&::-moz-range-thumb]:active:cursor-grabbing"
                      />
                    </div>

                    {/* Progress bar visual indicator */}
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        className={`h-full rounded-full ${
                          projectProgress === 100 ? "bg-green-500" : 
                          projectProgress >= 50 ? "bg-primary" : "bg-yellow-500"
                        }`}
                        initial={false}
                        animate={{ width: `${projectProgress}%` }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="description" className="text-right text-sm font-medium mt-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  maxLength={1000}
                  placeholder="Describe the project..."
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="startDate" className="text-right text-sm font-medium">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  value={projectStartDate}
                  onChange={(e) => setProjectStartDate(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. Oct 24, 2024"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="endDate" className="text-right text-sm font-medium">
                  End Date
                </label>
                <Input
                  id="endDate"
                  value={projectEndDate}
                  onChange={(e) => setProjectEndDate(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. Dec 12, 2024"
                />
              </div>

              {/* Tags */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="tags" className="text-right text-sm font-medium">
                  Tags
                </label>
                <Input
                  id="tags"
                  value={projectTags}
                  onChange={(e) => setProjectTags(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. UI Design, Development, Figma (comma separated)"
                />
              </div>


              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right text-sm font-medium">
                  Status
                </label>
                <div className="col-span-3">
                  <Select value={projectStatus} onValueChange={(val: string) => setProjectStatus(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Progress">In Progress</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || success}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {success ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            </form>
            
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
