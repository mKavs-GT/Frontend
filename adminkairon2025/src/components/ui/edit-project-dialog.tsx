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
  const [deliverables, setDeliverables] = useState<{title: string, link: string}[]>([]);
  const [meetings, setMeetings] = useState<{title: string, date: string, time: string, link: string, status: 'Upcoming' | 'Completed' | 'Cancelled'}[]>([]);
  const [subscription, setSubscription] = useState<{planName: string, price: string, nextBilling: string}>({planName: '', price: '', nextBilling: ''});
  const [invoices, setInvoices] = useState<{date: string, description: string, amount: string, status: string, link: string}[]>([]);
  const [messages, setMessages] = useState<{sender: string, content: string, date: string, isRead: boolean}[]>([]);
  
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
      setDeliverables(user.adminData?.deliverables || []);
      setMeetings(user.adminData?.meetings || []);
      setSubscription(user.adminData?.subscription || {planName: '', price: '', nextBilling: ''});
      setInvoices(user.adminData?.invoices || []);
      setMessages(user.adminData?.messages || []);
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
          projectStatus: projectStatus as "Active" | "Progress" | "On Hold" | "Completed",
          deliverables: deliverables.filter(d => d.title.trim() && d.link.trim()),
          meetings: meetings.filter(m => m.title.trim()),
          subscription: subscription,
          invoices: invoices.filter(i => i.date.trim() && i.amount.trim()),
          messages: messages.filter(m => m.content.trim()),
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
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg max-h-[85vh] overflow-y-auto custom-scrollbar"
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

              {/* Deliverables */}
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium mt-2">
                  Deliverables
                </label>
                <div className="col-span-3 space-y-3">
                  {deliverables.map((deliverable, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Title (e.g. Brand Guidelines)"
                        value={deliverable.title}
                        onChange={(e) => {
                          const newDeliverables = [...deliverables];
                          newDeliverables[index].title = e.target.value;
                          setDeliverables(newDeliverables);
                        }}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Link URL"
                        value={deliverable.link}
                        onChange={(e) => {
                          const newDeliverables = [...deliverables];
                          newDeliverables[index].link = e.target.value;
                          setDeliverables(newDeliverables);
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newDeliverables = deliverables.filter((_, i) => i !== index);
                          setDeliverables(newDeliverables);
                        }}
                        className="text-destructive h-10 w-10 shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDeliverables([...deliverables, { title: "", link: "" }])}
                    className="w-full border-dashed"
                  >
                    + Add Deliverable
                  </Button>
                </div>
              </div>

              {/* Meetings */}
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium mt-2">Meetings</label>
                <div className="col-span-3 space-y-3">
                  {meetings.map((meeting, index) => (
                    <div key={index} className="flex gap-2 items-center flex-wrap p-3 border rounded-md relative group">
                      <Button type="button" variant="ghost" size="icon" onClick={() => setMeetings(meetings.filter((_, i) => i !== index))} className="absolute top-1 right-1 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-4 w-4" /></Button>
                      <Input placeholder="Meet Title" value={meeting.title} onChange={e => { const m = [...meetings]; m[index].title = e.target.value; setMeetings(m); }} className="w-1/2" />
                      <Input placeholder="e.g. Apr 12, 2026" value={meeting.date} onChange={e => { const m = [...meetings]; m[index].date = e.target.value; setMeetings(m); }} className="w-5/12" />
                      <Input placeholder="10:00 AM" value={meeting.time} onChange={e => { const m = [...meetings]; m[index].time = e.target.value; setMeetings(m); }} className="w-1/3" />
                      <Input placeholder="Link (google meet)" value={meeting.link} onChange={e => { const m = [...meetings]; m[index].link = e.target.value; setMeetings(m); }} className="w-1/3" />
                      <Select value={meeting.status} onValueChange={(val: any) => { const m = [...meetings]; m[index].status = val; setMeetings(m); }}>
                        <SelectTrigger className="w-1/4"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Upcoming">Upcoming</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent>
                      </Select>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => setMeetings([...meetings, { title: '', date: '', time: '', link: '', status: 'Upcoming' }])} className="w-full border-dashed">+ Add Meeting</Button>
                </div>
              </div>

              {/* Subscription */}
              <div className="grid grid-cols-4 items-start gap-4 p-4 bg-muted/30 rounded-lg">
                <label className="text-right text-sm font-medium mt-2">Active Plan</label>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                   <Input placeholder="e.g. Pro Tier" value={subscription.planName} onChange={e => setSubscription({...subscription, planName: e.target.value})} className="col-span-2" />
                   <Input placeholder="e.g. $299/mo" value={subscription.price} onChange={e => setSubscription({...subscription, price: e.target.value})} />
                   <Input placeholder="Next Billing (e.g. Apr 15)" value={subscription.nextBilling} onChange={e => setSubscription({...subscription, nextBilling: e.target.value})} />
                </div>
              </div>

              {/* Invoices */}
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium mt-2">Invoices</label>
                <div className="col-span-3 space-y-3">
                  {invoices.map((inv, index) => (
                    <div key={index} className="flex gap-2 items-center flex-wrap p-3 border rounded-md relative group">
                      <Button type="button" variant="ghost" size="icon" onClick={() => setInvoices(invoices.filter((_, i) => i !== index))} className="absolute top-1 right-1 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-4 w-4" /></Button>
                      <Input placeholder="Date (e.g. Mar 15)" value={inv.date} onChange={e => { const m = [...invoices]; m[index].date = e.target.value; setInvoices(m); }} className="w-1/3" />
                      <Input placeholder="Amount ($299)" value={inv.amount} onChange={e => { const m = [...invoices]; m[index].amount = e.target.value; setInvoices(m); }} className="w-1/3" />
                      <Input placeholder="Status (Paid)" value={inv.status} onChange={e => { const m = [...invoices]; m[index].status = e.target.value; setInvoices(m); }} className="w-1/4" />
                      <Input placeholder="Description" value={inv.description} onChange={e => { const m = [...invoices]; m[index].description = e.target.value; setInvoices(m); }} className="w-[48%]" />
                      <Input placeholder="Download Link" value={inv.link} onChange={e => { const m = [...invoices]; m[index].link = e.target.value; setInvoices(m); }} className="w-[48%]" />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => setInvoices([...invoices, { date: '', amount: '', description: '', status: 'Paid', link: '' }])} className="w-full border-dashed">+ Add Invoice</Button>
                </div>
              </div>

              {/* Messages */}
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium mt-2">Messages</label>
                <div className="col-span-3 space-y-3">
                  {messages.map((msg, index) => (
                    <div key={index} className="flex gap-2 items-start flex-wrap p-3 border rounded-md relative group">
                      <Button type="button" variant="ghost" size="icon" onClick={() => setMessages(messages.filter((_, i) => i !== index))} className="absolute top-1 right-1 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-4 w-4" /></Button>
                      <textarea placeholder="Message content..." value={msg.content} onChange={e => { const m = [...messages]; m[index].content = e.target.value; setMessages(m); }} className="w-full flex min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => setMessages([...messages, { sender: 'System Admin', content: '', date: new Date().toISOString(), isRead: false }])} className="w-full border-dashed">+ Send Message to Inbox</Button>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
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
