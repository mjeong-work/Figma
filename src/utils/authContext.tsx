import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  avatar?: string;
  graduationYear?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
  graduationYear?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (stored in localStorage)
const getUsersFromStorage = (): User[] => {
  const users = localStorage.getItem('campusconnect_users');
  if (users) {
    return JSON.parse(users);
  }
  // Default admin user
  return [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@university.edu',
      role: 'Administrator',
      department: 'Administration',
      verified: true,
      status: 'approved',
    },
  ];
};

const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem('campusconnect_users', JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Auto-login with a default user (bypass sign-in for now)
    const currentUser = localStorage.getItem('campusconnect_currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    } else {
      // Create and set a default approved user
      const defaultUser: User = {
        id: 'default-user-1',
        email: 'student@campus.edu',
        name: 'Demo Student',
        role: 'student',
        status: 'approved',
        studentId: 'STU12345',
        major: 'Computer Science',
        graduationYear: '2026',
        bio: 'Campus Connect user',
        profileImage: undefined,
        createdAt: Date.now()
      };
      setUser(defaultUser);
      localStorage.setItem('campusconnect_currentUser', JSON.stringify(defaultUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getUsersFromStorage();
    const foundUser = users.find((u) => u.email === email);

    if (!foundUser) {
      return { success: false, message: 'Invalid email or password' };
    }

    // In a real app, you'd verify password hash
    // For demo purposes, we'll accept any password except empty
    if (!password) {
      return { success: false, message: 'Password is required' };
    }

    // Check if user is approved
    if (foundUser.status === 'pending') {
      return { success: false, message: 'Your account is pending approval. Please check back later.' };
    }

    if (foundUser.status === 'rejected') {
      return { success: false, message: 'Your account has been rejected. Please contact support.' };
    }

    // Successful login
    setUser(foundUser);
    localStorage.setItem('campusconnect_currentUser', JSON.stringify(foundUser));
    return { success: true, message: 'Login successful' };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate campus email
    if (!data.email.endsWith('.edu')) {
      return { success: false, message: 'Please use a valid campus email address (.edu)' };
    }

    const users = getUsersFromStorage();

    // Check if email already exists
    if (users.some((u) => u.email === data.email)) {
      return { success: false, message: 'An account with this email already exists' };
    }

    // Create new user (pending approval)
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      graduationYear: data.graduationYear,
      verified: false,
      status: 'pending',
    };

    users.push(newUser);
    saveUsersToStorage(users);

    // Log them in with pending status
    setUser(newUser);
    localStorage.setItem('campusconnect_currentUser', JSON.stringify(newUser));

    return { success: true, message: 'Registration successful! Your account is pending approval.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusconnect_currentUser');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('campusconnect_currentUser', JSON.stringify(updatedUser));

    // Update in users storage
    const users = getUsersFromStorage();
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      saveUsersToStorage(users);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
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

// Helper functions for admin to manage users
export const getPendingUsers = (): User[] => {
  const users = getUsersFromStorage();
  return users.filter((u) => u.status === 'pending');
};

export const approveUser = (userId: string) => {
  const users = getUsersFromStorage();
  const index = users.findIndex((u) => u.id === userId);
  if (index !== -1) {
    users[index].status = 'approved';
    users[index].verified = true;
    saveUsersToStorage(users);

    // Update current user if they're the one being approved
    const currentUser = localStorage.getItem('campusconnect_currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.id === userId) {
        user.status = 'approved';
        user.verified = true;
        localStorage.setItem('campusconnect_currentUser', JSON.stringify(user));
      }
    }
  }
};

export const rejectUser = (userId: string) => {
  const users = getUsersFromStorage();
  const index = users.findIndex((u) => u.id === userId);
  if (index !== -1) {
    users[index].status = 'rejected';
    saveUsersToStorage(users);

    // Update current user if they're the one being rejected
    const currentUser = localStorage.getItem('campusconnect_currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.id === userId) {
        user.status = 'rejected';
        localStorage.setItem('campusconnect_currentUser', JSON.stringify(user));
      }
    }
  }
};