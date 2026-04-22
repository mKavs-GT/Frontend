import { useState } from "react";
import { ProjectDetailView } from "@/components/ui/project-detail-view";
import { Sidebar } from "@/components/ui/modern-side-bar";
import ProjectDataDemo from "@/ProjectDataDemo";
import { type User, updateUser } from "@/lib/api";
import { EditProjectDialog } from "@/components/ui/edit-project-dialog";
import { AnalyticsView } from "@/components/ui/analytics-view";
import { ProfileView } from "@/components/ui/ProfileView";
import { UsersView } from "@/components/ui/users-view";
import { ConsultationsView } from "@/components/ui/consultations-view";
import { ScheduleView } from "@/components/ui/schedule-view";
import { SprintPlanningView } from "@/components/ui/sprint-planning-view";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Bell, Search } from "lucide-react";

interface AdminAgent {
  email: string;
  name: string;
  role: string;
}

interface DemoProps {
  onBack?: () => void;
  user: User;
  onUserUpdated: (user: User) => void;
  onLogout?: () => void;
  adminAgent?: AdminAgent | null;
}

export const Demo = ({ onBack, user, onUserUpdated, onLogout, adminAgent }: DemoProps) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSaveUser = async (updatedData: Partial<User>) => {
    const freshUser = await updateUser(user.email, updatedData);
    if (freshUser) {
      onUserUpdated(freshUser);
    }
  };

  const projectData = {
    breadcrumbs: [
      { label: "Dashboard", href: "#" },
      { label: "Projects", href: "#" },
      { label: user.adminData?.activeProjects || "Project Details", href: "#" },
    ],
    title: user.adminData?.activeProjects || "Untitled Project",
    status: user.adminData?.projectStatus || (user.adminData?.projectProgress && user.adminData.projectProgress === 100 ? "Completed" : "Active"),
    progress: user.adminData?.projectProgress || 0,
    assignees: [
      {
        name: user.displayName || user.email || "Unknown User",
        avatarUrl: user.image || "https://github.com/shadcn.png",
      },
      {
        name: "Admin Team",
        avatarUrl: "https://github.com/shadcn.png",
      }
    ],
    dateRange: {
      start: user.adminData?.projectStartDate || "N/A",
      end: user.adminData?.projectEndDate || "Present",
    },
    tags: user.adminData?.projectTags?.map(tag => ({ label: tag, variant: "default" as const })) || [],
    description: user.adminData?.projectDescription || `Project for ${user.displayName || user.email || "Unknown User"}. Contact email: ${user.email}.`,
    subTasks: user.adminData?.tasks && user.adminData.tasks.length > 0
      ? user.adminData.tasks.map(task => ({
          id: task.id,
          task: task.task,
          category: task.category,
          status: task.status as "Completed" | "In Progress" | "Pending",
          dueDate: task.dueDate
        }))
      : [],
  };

  const handleNavigate = (viewId: string) => {
    setActiveView(viewId);
  };

  const renderContent = () => {
    switch (activeView) {
      case "settings":
        return <ProjectDataDemo />;
      case "analytics":
        return (
          <AnalyticsView 
            onViewProject={(targetUser) => {
              onUserUpdated(targetUser);
              setActiveView("dashboard");
            }} 
          />
        );
      case "profile":
        return <ProfileView adminAgent={adminAgent || null} />;
      case "users":
        return (
          <UsersView 
             onViewProject={(targetUser) => {
               onUserUpdated(targetUser);
               setActiveView("dashboard");
             }} 
          />
        );
      case "consultations":
        return <ConsultationsView />;
      case "schedule":
        return <ScheduleView />;
      case "sprint":
        return <SprintPlanningView />;
      default:
        return (
          <>
            <ProjectDetailView 
              {...projectData} 
              onBack={onBack} 
              onEdit={() => setIsEditDialogOpen(true)}
              userEmail={user.email}
              onUserUpdated={onUserUpdated}
            />
            <EditProjectDialog
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              user={user}
              onSave={handleSaveUser}
            />
          </>
        );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F7FE] dark:bg-zinc-950 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar onNavigate={handleNavigate} activeItem={activeView} onLogout={onLogout} adminAgent={adminAgent} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Global Header for Inner Pages */}
        {activeView !== "dashboard" && activeView !== "sprint" && (
           <header className="h-[90px] shrink-0 flex items-center justify-between px-8 bg-transparent">
              <div className="flex items-center gap-6">
                 <h1 className="text-[24px] font-black text-zinc-800 dark:text-white tracking-tighter uppercase italic">{activeView}</h1>
                 <div className="relative w-[300px] hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                       type="text" 
                       placeholder="Search..." 
                       className="w-full h-[44px] bg-white dark:bg-zinc-900 rounded-[12px] pl-10 pr-4 text-[13px] border-none shadow-sm focus:outline-none"
                    />
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <ThemeToggle />
                 <button className="h-[44px] w-[44px] bg-white dark:bg-zinc-900 rounded-[12px] flex items-center justify-center text-zinc-400 shadow-sm">
                    <Bell className="w-5 h-5" />
                 </button>
              </div>
           </header>
        )}

        <main className="flex-1 h-full overflow-y-auto scrollbar-hide">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Demo;
