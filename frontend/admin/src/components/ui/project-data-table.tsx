// import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- TYPE DEFINITIONS ---
type StatusVariant = "active" | "inProgress" | "onHold" | "completed";

export interface Project {
  id: string;
  name: string;
  repository: string;
  team: string;
  tech: string;
  createdAt: string;
  status: {
    text: string;
    variant: StatusVariant;
  };
  originalData?: User; // To pass back to edit handler
}

// --- PROPS INTERFACE ---
interface ProjectDataTableProps {
  projects: Project[];
  visibleColumns: Set<keyof Project>;
  onEdit?: (project: Project) => void;
}

// --- STATUS BADGE VARIANTS ---
const badgeVariants = cva("capitalize text-white text-[10px] px-2 py-0 h-5", {
  variants: {
    variant: {
      active: "bg-green-500/80 hover:bg-green-600",
      inProgress: "bg-yellow-500/80 hover:bg-yellow-600",
      onHold: "bg-red-500/80 hover:bg-red-600",
      completed: "bg-blue-500/80 hover:bg-blue-600",
    },
  },
  defaultVariants: {
    variant: "active",
  },
});

// --- MAIN COMPONENT ---
export const ProjectDataTable = ({ projects, visibleColumns, onEdit }: ProjectDataTableProps) => {
  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.2,
        ease: "easeOut",
      },
    }),
  };
  
  const tableHeaders: { key: string; label: string }[] = [
    { key: "name", label: "Project" },
    { key: "repository", label: "Repository" },
    { key: "team", label: "Team" },
    { key: "tech", label: "Tech" },
    { key: "createdAt", label: "Created At" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md text-card-foreground shadow-xl overflow-hidden">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border/50">
              {tableHeaders
                .filter((header) => header.key === "actions" || visibleColumns.has(header.key as keyof Project))
                .map((header) => (
                  <TableHead key={header.key} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-4">
                    {header.label}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <motion.tr
                  key={project.id + "-" + index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants as Record<string, unknown>}
                  className="group border-b border-border/40 transition-all hover:bg-primary/5"
                >
                  {visibleColumns.has("name") && (
                    <TableCell className="font-medium text-sm py-4">
                      {project.name}
                    </TableCell>
                  )}
                  
                  {visibleColumns.has("repository") && (
                    <TableCell className="py-4">
                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary group/link"
                      >
                        <span className="truncate max-w-[150px]">{project.repository.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    </TableCell>
                  )}
                  
                  {visibleColumns.has("team") && <TableCell className="text-xs text-muted-foreground py-4">{project.team}</TableCell>}
                  {visibleColumns.has("tech") && (
                    <TableCell className="py-4">
                      <span className="text-[10px] font-medium bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full">
                        {project.tech}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.has("createdAt") && <TableCell className="text-[10px] text-muted-foreground py-4">{project.createdAt}</TableCell>}
                  
                  {visibleColumns.has("status") && (
                    <TableCell className="py-4">
                      <Badge className={cn(badgeVariants({ variant: project.status.variant }), "shadow-none border-none")}>
                        {project.status.text}
                      </Badge>
                    </TableCell>
                  )}

                  <TableCell className="py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                      onClick={() => onEdit?.(project)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.size + 1} className="h-32 text-center text-muted-foreground italic">
                  No projects found in database.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
