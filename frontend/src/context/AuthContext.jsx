import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Restore authenticated session on initial app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const data = await authService.getProfile();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            throw new Error('Failed to fetch user profile');
          }
        } catch (error) {
          console.warn('[Auth] Session validation failed:', error.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoadingAuth(false);
    };

    initAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome to ConnectHub, ${data.user.name}!`);
        return { success: true, user: data.user };
      }
      throw new Error(data.message || 'Registration failed');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return { success: true, user: data.user };
      }
      throw new Error(data.message || 'Login failed');
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Profile updated successfully!');
        return { success: true, user: data.user };
      }
      throw new Error(data.message || 'Update failed');
    } catch (error) {
      toast.error(error.message || 'Could not update profile');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    loadingAuth,
    login,
    register,
    logout,
    updateProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
