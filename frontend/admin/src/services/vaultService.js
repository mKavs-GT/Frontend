import { API_BASE_URL } from '../config';

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('mkavs_admin_user'));
  return {
    'Content-Type': 'application/json',
    ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
  };
};

export const vaultService = {
  // Public (Display)
  getCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/api/vault/categories`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  // Admin Categories
  getAdminCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/api/vault/admin/categories`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch admin categories');
    return res.json();
  },
  createCategory: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/vault/admin/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },
  updateCategory: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/vault/admin/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },
  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/vault/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return res.json();
  },

  // Admin Items
  getAdminItems: async (categoryId) => {
    const res = await fetch(`${API_BASE_URL}/api/vault/admin/categories/${categoryId}/items`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch admin items');
    return res.json();
  },
  getAdminItem: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/vault/admin/items/${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch item details');
    return res.json();
  },
  createItem: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/vault/admin/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create item');
    return res.json();
  },
  updateItem: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/vault/admin/items/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update item');
    return res.json();
  },
  deleteItem: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/vault/admin/items/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete item');
    return res.json();
  },
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const user = JSON.parse(localStorage.getItem('mkavs_admin_user'));
    const headers = {};
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/vault/admin/upload`, {
      method: 'POST',
      headers, // No Content-Type, let browser set boundary
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload file');
    return res.json();
  }
};
