export interface User {
  _id: string;
  displayName: string;
  email: string;
  image?: string;
  phone?: string;
  country?: string;
  createdAt?: string;
  adminData?: {
    activeProjects?: string;
    projectProgress?: number;
    projectDescription?: string;
    projectStartDate?: string;
    projectEndDate?: string;
    projectStatus?: 'Active' | 'Progress' | 'On Hold' | 'Completed';
    projectTags?: string[];
    tasks?: {
      id: number;
      task: string;
      category: string;
      status: 'Pending' | 'In Progress' | 'Completed';
      dueDate: string;
    }[];
  };
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper to get token from storage
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('adminToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/users`, {
      headers: {
        ...getAuthHeaders()
      },
      credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const updateUser = async (email: string, data: Partial<User>): Promise<User | null> => {
  try {
    const encodedEmail = encodeURIComponent(email.toLowerCase().trim());
    const response = await fetch(`${API_BASE}/api/admin/user/${encodedEmail}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to update user');
    }
    const result = await response.json();
    return result.user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const addTask = async (email: string, taskData: { task: string; category: string; status: string; dueDate: string }): Promise<User | null> => {
  try {
    const encodedEmail = encodeURIComponent(email.toLowerCase().trim());
    const response = await fetch(`${API_BASE}/api/admin/user/${encodedEmail}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      credentials: 'include',
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to add task' }));
      throw new Error(errorData.error || 'Failed to add task');
    }
    
    const result = await response.json();
    return result.user;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const updateTask = async (email: string, taskId: number, taskData: Partial<{ task: string; category: string; status: string; dueDate: string }>): Promise<User | null> => {
  try {
    const encodedEmail = encodeURIComponent(email.toLowerCase().trim());
    const response = await fetch(`${API_BASE}/api/admin/user/${encodedEmail}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      credentials: 'include',
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to update task' }));
      throw new Error(errorData.error || 'Failed to update task');
    }
    
    const result = await response.json();
    return result.user;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (email: string, taskId: number): Promise<User | null> => {
  try {
    const encodedEmail = encodeURIComponent(email.toLowerCase().trim());
    const response = await fetch(`${API_BASE}/api/admin/user/${encodedEmail}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to delete task' }));
      throw new Error(errorData.error || 'Failed to delete task');
    }
    
    const result = await response.json();
    return result.user;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// ============ PROJECT MANAGEMENT API ============

export interface Contributor {
  name: string;
  avatarUrl?: string;
}

export interface Project {
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

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/projects`, {
      headers: {
        ...getAuthHeaders()
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const fetchProject = async (id: string): Promise<Project | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/projects/${id}`, {
      headers: {
        ...getAuthHeaders()
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    const data = await response.json();
    return data.project;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

export const createProject = async (projectData: Omit<Project, '_id' | 'createdAt' | 'lastUpdated'>): Promise<Project | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      credentials: 'include',
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to create project' }));
      throw new Error(errorData.error || 'Failed to create project');
    }
    
    const result = await response.json();
    return result.project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      credentials: 'include',
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to update project' }));
      throw new Error(errorData.error || 'Failed to update project');
    }
    
    const result = await response.json();
    return result.project;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to delete project' }));
      throw new Error(errorData.error || 'Failed to delete project');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const bulkSyncProjects = async (projects: Partial<Project>[]): Promise<{
  created: number;
  updated: number;
  failed: number;
  details: unknown;
}> => {
  try {
    const response = await fetch(`${API_BASE}/api/projects/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      credentials: 'include',
      body: JSON.stringify({ projects }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to sync projects' }));
      throw new Error(errorData.error || 'Failed to sync projects');
    }
    
    const result = await response.json();
    return result.results;
  } catch (error) {
    console.error('Error syncing projects:', error);
    throw error;
  }
};
