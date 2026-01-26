"use client";

import { useState, useMemo, useEffect } from "react";
import { ProjectDataTable, type Project } from "@/components/ui/project-data-table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter, Columns, Loader2 } from "lucide-react";
import { fetchUsers, type User, updateUser } from "@/lib/api";
import { EditProjectDataDialog } from "@/components/ui/edit-project-data-dialog";

const allColumns: (keyof Project)[] = ["name", "repository", "team", "tech", "createdAt", "status"];

const ProjectDataDemo = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [techFilter, setTechFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof Project>>(new Set(allColumns));
  
  // Edit State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<User | null>(null);

  const loadProjects = async () => {
      try {
        setLoading(true);
        const users = await fetchUsers();
        
        // Map API users to table projects
        const mappedProjects: Project[] = users
          .filter(user => user.adminData?.activeProjects) // Only users with active projects
          .map((user: User) => {
          let variant: "active" | "inProgress" | "onHold" | "completed" = "active";
          const status = user.adminData?.projectStatus;
          if (status === "Progress") variant = "inProgress";
          else if (status === "On Hold") variant = "onHold";
          else if (status === "Completed") variant = "completed";
          else if (user.adminData?.projectProgress === 100) variant = "completed";
          
          return {
            id: user._id,
            name: user.adminData?.activeProjects || "Untitled",
            repository: "N/A", // Not in adminData
            team: user.displayName || "Unknown",
            tech: "N/A", // Not in adminData
            createdAt: user.adminData?.projectStartDate || (user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()),
            status: {
              text: status || (variant === "completed" ? "Completed" : "Active"),
              variant: variant
            },
            originalData: user as User // Store full user to allow potential editing if needed
          };
        });
        
        setProjects(mappedProjects);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEditClick = (project: Project) => {
    setProjectToEdit(project.originalData);
    setIsEditDialogOpen(true);
  };

  const handleSaveProject = async (idOrEmail: string, updatedData: Partial<User>) => {
    try {
      if (idOrEmail.includes('@')) {
          await updateUser(idOrEmail, updatedData);
      } else {
          // Fallback if we accidentally pass ID, though updateUser needs email. 
          // For now, assume email is passed.
           console.error("Expected email for user update, got:", idOrEmail);
      }
      
      // Refresh the list after update
      await loadProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      throw error; // Let the dialog handle the error display
    }
  };


  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const techMatch = techFilter === "" || project.tech.toLowerCase().includes(techFilter.toLowerCase());
      const statusMatch = statusFilter === "all" || project.status.variant === statusFilter;
      return techMatch && statusMatch;
    });
  }, [projects, techFilter, statusFilter]);

  const toggleColumn = (column: keyof Project) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading project data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Project Data</h1>
          <p className="text-muted-foreground">
            View and manage all your projects in one place.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
          <div className="flex flex-1 gap-4">
            <Input
              placeholder="Filter by technology..."
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="max-w-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ListFilter className="h-4 w-4" />
                  <span>Status</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={statusFilter === "all"} onCheckedChange={() => setStatusFilter("all")}>All</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={statusFilter === "active"} onCheckedChange={() => setStatusFilter("active")}>Active</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={statusFilter === "inProgress"} onCheckedChange={() => setStatusFilter("inProgress")}>In Progress</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={statusFilter === "onHold"} onCheckedChange={() => setStatusFilter("onHold")}>On Hold</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Columns className="h-4 w-4" />
                <span>Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column}
                  className="capitalize"
                  checked={visibleColumns.has(column)}
                  onCheckedChange={() => toggleColumn(column)}
                >
                  {column}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <ProjectDataTable 
          projects={filteredProjects} 
          visibleColumns={visibleColumns} 
          onEdit={handleEditClick}
        />

        {/* Edit Dialog */}
        <EditProjectDataDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          project={projectToEdit}
          onSave={handleSaveProject}
        />
      </div>
    </div>
  );
};

export default ProjectDataDemo;
