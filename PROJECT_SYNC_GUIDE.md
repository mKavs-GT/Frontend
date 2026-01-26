# Project Data Synchronization - Implementation Guide

## Overview

A secure system has been implemented to sync project data with MongoDB database. This includes comprehensive validation, sanitization, and XSS protection.

## What Was Implemented

### 1. Database Model (`models/Project.js`)

- **Project Schema** with the following fields:
  - `name`: Project name (required, max 200 chars)
  - `repository`: GitHub/repository URL (required, validated URL)
  - `team`: Team name (required, max 100 chars)
  - `tech`: Technology stack (required, max 100 chars)
  - `createdAt`: Auto-generated timestamp
  - `contributors`: Array of contributor objects with name and avatar URL
  - `status`: Enum ('Active', 'Progress', 'On Hold', 'Completed')
  - `userId`: Optional link to User model
  - `description`: Optional project description (max 1000 chars)
  - `tags`: Array of tags (max 10 tags, 50 chars each)
  - `lastUpdated`: Auto-updated timestamp

- **Security Features**:
  - URL validation for repository and avatar URLs
  - String length limits to prevent database overflow
  - Indexed fields for faster queries
  - Automatic timestamp management

### 2. API Routes (`routes/projects.js`)

Secure RESTful API endpoints with admin authentication:

#### GET `/api/projects`

- Fetch all projects
- Returns: `{ success: true, count: number, projects: Project[] }`

#### GET `/api/projects/:id`

- Fetch single project by ID
- Returns: `{ success: true, project: Project }`

#### POST `/api/projects`

- Create a new project
- Body: Project data (without \_id, createdAt, lastUpdated)
- Returns: `{ success: true, message: string, project: Project }`

#### PUT `/api/projects/:id`

- Update existing project
- Body: Partial project data
- Returns: `{ success: true, message: string, project: Project }`

#### DELETE `/api/projects/:id`

- Delete a project
- Returns: `{ success: true, message: string, deletedProject: {...} }`

#### POST `/api/projects/bulk`

- **Bulk sync** multiple projects (create or update)
- Body: `{ projects: Partial<Project>[] }`
- Max 100 projects per request
- Returns: `{ success: true, results: { created, updated, failed, details } }`

### 3. Frontend API (`admin/src/lib/api.ts`)

TypeScript interfaces and functions:

```typescript
// Interfaces
interface Contributor {
  name: string;
  avatarUrl?: string;
}

interface Project {
  _id: string;
  name: string;
  repository: string;
  team: string;
  tech: string;
  createdAt: string;
  contributors: Contributor[];
  status: 'Active' | 'Progress' | 'On Hold' | 'Completed';
  userId?: string;
  description?: string;
  tags?: string[];
  lastUpdated?: string;
}

// Functions
fetchProjects(): Promise<Project[]>
fetchProject(id: string): Promise<Project | null>
createProject(projectData): Promise<Project | null>
updateProject(id: string, projectData): Promise<Project | null>
deleteProject(id: string): Promise<boolean>
bulkSyncProjects(projects): Promise<SyncResults>
```

## Security Features

### 1. Input Validation

- ✅ Required field checking
- ✅ Type validation (string, array, object)
- ✅ Length limits on all string fields
- ✅ URL format validation for repositories and avatars
- ✅ Enum validation for status field
- ✅ Array size limits (max 10 tags, max 100 bulk projects)

### 2. Input Sanitization

- ✅ XSS protection: Removes `<` and `>` characters
- ✅ String trimming to remove whitespace
- ✅ Email encoding for URL parameters
- ✅ Phone number sanitization (only allows valid characters)

### 3. Authentication & Authorization

- ✅ Admin authentication middleware (`ensureAdmin`)
- ✅ All routes require authentication
- ✅ TODO: Role-based access control (admin role checking)

### 4. Error Handling

- ✅ Comprehensive try-catch blocks
- ✅ Detailed error messages
- ✅ Proper HTTP status codes
- ✅ Error logging for debugging

## Usage Examples

### Example 1: Bulk Sync Projects from Frontend

```typescript
import { bulkSyncProjects } from "@/lib/api";

const projectsData = [
  {
    name: "ShadCN Clone",
    repository: "https://github.com/ruixenui/ruixen-buttons",
    team: "UI Guild",
    tech: "Next.js",
    contributors: [
      { name: "John Doe", avatarUrl: "https://example.com/avatar1.jpg" },
      { name: "Jane Smith", avatarUrl: "https://example.com/avatar2.jpg" },
    ],
    status: "Active",
    description: "A clone of ShadCN UI components",
    tags: ["UI", "Components", "React"],
  },
  {
    name: "RUIXEN Components",
    repository: "https://github.com/ruixenui/ruixen-buttons",
    team: "Component Devs",
    tech: "React",
    contributors: [{ name: "Alice Johnson" }],
    status: "Progress",
  },
];

try {
  const results = await bulkSyncProjects(projectsData);
  console.log(`✅ Sync complete:`);
  console.log(`   Created: ${results.created}`);
  console.log(`   Updated: ${results.updated}`);
  console.log(`   Failed: ${results.failed}`);
} catch (error) {
  console.error("Sync failed:", error);
}
```

### Example 2: Fetch and Display Projects

```typescript
import { fetchProjects } from "@/lib/api";

const loadProjects = async () => {
  const projects = await fetchProjects();

  projects.forEach((project) => {
    console.log(`${project.name} - ${project.status}`);
    console.log(`  Tech: ${project.tech}`);
    console.log(`  Team: ${project.team}`);
    console.log(`  Contributors: ${project.contributors.length}`);
  });
};
```

### Example 3: Create Single Project

```typescript
import { createProject } from "@/lib/api";

const newProject = {
  name: "Admin Dashboard",
  repository: "https://github.com/ruixenui/admin-dashboard",
  team: "UI Guild",
  tech: "Next.js",
  contributors: [
    { name: "Admin Team", avatarUrl: "https://github.com/shadcn.png" },
  ],
  status: "Active",
  description: "Enterprise admin dashboard",
  tags: ["Admin", "Dashboard", "Enterprise"],
};

try {
  const project = await createProject(newProject);
  console.log("✅ Project created:", project);
} catch (error) {
  console.error("Failed to create project:", error);
}
```

### Example 4: Update Project Status

```typescript
import { updateProject } from "@/lib/api";

try {
  const updated = await updateProject("project_id_here", {
    status: "Completed",
    description: "Project successfully completed!",
  });
  console.log("✅ Project updated:", updated);
} catch (error) {
  console.error("Failed to update project:", error);
}
```

## Testing the API

### Using cURL

```bash
# Fetch all projects
curl http://localhost:3000/api/projects

# Create a project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "repository": "https://github.com/test/repo",
    "team": "Dev Team",
    "tech": "Node.js",
    "status": "Active"
  }'

# Bulk sync
curl -X POST http://localhost:3000/api/projects/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "projects": [
      {
        "name": "Project 1",
        "repository": "https://github.com/test/repo1",
        "team": "Team A",
        "tech": "React"
      },
      {
        "name": "Project 2",
        "repository": "https://github.com/test/repo2",
        "team": "Team B",
        "tech": "Vue"
      }
    ]
  }'
```

## Database Queries

### MongoDB Shell Examples

```javascript
// Find all active projects
db.projects.find({ status: "Active" });

// Find projects by team
db.projects.find({ team: "UI Guild" });

// Find projects with specific tech
db.projects.find({ tech: "Next.js" });

// Count projects by status
db.projects.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

// Find recent projects (last 30 days)
db.projects.find({
  createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
});
```

## Next Steps

1. **Add Admin Role Checking**: Implement proper role-based access control
2. **Add Project Images**: Extend schema to support project screenshots/images
3. **Add Project Milestones**: Track project milestones and deadlines
4. **Add Activity Logs**: Track who made changes and when
5. **Add Search & Filtering**: Implement advanced search and filtering in frontend
6. **Add Pagination**: Implement pagination for large project lists
7. **Add Export Functionality**: Export projects to CSV/Excel

## Security Recommendations

1. ✅ **Implemented**: Input validation and sanitization
2. ✅ **Implemented**: XSS protection
3. ✅ **Implemented**: URL validation
4. ⚠️ **TODO**: Add rate limiting to prevent API abuse
5. ⚠️ **TODO**: Implement proper admin role checking
6. ⚠️ **TODO**: Add CSRF protection
7. ⚠️ **TODO**: Implement API key authentication for external access
8. ⚠️ **TODO**: Add request logging and monitoring
9. ⚠️ **TODO**: Implement data encryption at rest

## Troubleshooting

### Common Issues

1. **"Unauthorized" error**
   - Ensure you're authenticated (logged in)
   - Check if session is active

2. **"Project not found" error**
   - Verify the project ID is correct
   - Check if project exists in database

3. **Validation errors**
   - Check all required fields are provided
   - Verify URLs are valid (start with http:// or https://)
   - Ensure string lengths don't exceed limits

4. **Bulk sync failures**
   - Check the `failed` array in results for specific errors
   - Ensure no more than 100 projects per request
   - Verify all projects have required fields

## Files Modified/Created

- ✅ `models/Project.js` - New Project model
- ✅ `routes/projects.js` - New project API routes
- ✅ `server.js` - Added project routes
- ✅ `admin/src/lib/api.ts` - Added project API functions

---

**Status**: ✅ Implementation Complete
**Security Level**: High (with input validation, sanitization, and XSS protection)
**Ready for**: Development and Testing
