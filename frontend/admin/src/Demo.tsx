import { useState } from "react";
import { ProjectDetailView } from "@/components/ui/project-detail-view";
import { Sidebar } from "@/components/ui/modern-side-bar";
import ProjectDataDemo from "@/ProjectDataDemo";
import { type User, updateUser } from "@/lib/api";
import { EditProjectDialog } from "@/components/ui/edit-project-dialog";
import { AnalyticsView } from "@/components/ui/analytics-view";
import { ProfileView } from "@/components/ui/ProfileView";

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

  // Map user data to project detail view props
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
        return <ProfileView adminAgent={adminAgent} />;
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
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar onNavigate={handleNavigate} activeItem={activeView} onLogout={onLogout} adminAgent={adminAgent} />
      
      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Demo;
