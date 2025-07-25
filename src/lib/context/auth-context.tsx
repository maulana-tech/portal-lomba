import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface UserWithPassword extends User {
  password: string;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  loading: true,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// Mock users for demo
const initialUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: 'admin123' // In a real app, this would be hashed
  },
  {
    id: '2',
    name: 'Student User',
    email: 'student@example.com',
    role: 'student' as UserRole,
    university: 'University of Example',
    faculty: 'Computer Science',
    skills: ['React', 'JavaScript', 'UI/UX'],
    createdAt: new Date(),
    updatedAt: new Date(),
    password: 'student123'
  },
  {
    id: '3',
    name: 'Lecturer User',
    email: 'lecturer@example.com',
    role: 'lecturer' as UserRole,
    university: 'University of Example',
    faculty: 'Engineering',
    createdAt: new Date(),
    updatedAt: new Date(),
    password: 'lecturer123'
  }
];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Initialize users if not already initialized
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    
    setLoading(false);
  }, []);

  // Store user to localStorage when changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user by email and password
      const foundUser = users.find(
        (u: UserWithPassword) => u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Remove password before setting user
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string, role: UserRole = 'student') => {
    try {
      setLoading(true);
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user with email already exists
      if (users.some((u: UserWithPassword) => u.email === email)) {
        return false;
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        password
      };
      
      // Add new user to users
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Remove password before setting user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}