import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdminAgent {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: AdminAgent | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, agent: AdminAgent) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminAgent | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/admin/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Important: Include credentials to send cookies
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.agent);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (token: string, agent: AdminAgent) => {
    // Token is mainly handled by the HTTP-only cookie now,
    // but we can still store agent info in localStorage for UI speed if needed,
    // though AuthContext state is preferred.
    setUser(agent);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Optional: Redirect will be handled by the router or AuthGate
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
