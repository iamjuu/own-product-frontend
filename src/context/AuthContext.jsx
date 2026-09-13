import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiClient from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = ApiClient.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await ApiClient.get('/auth/me');
      if (response.success && response.data.user) {
        setUser(response.data.user);
      } else {
        ApiClient.setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.warn('Session expired or invalid:', err.message);
      ApiClient.setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiClient.post('/auth/login', { email, password });
      if (response.requiresOtp) {
        return {
          success: true,
          requiresOtp: true,
          email: response.data?.email || email,
          message: response.message,
        };
      }
      if (response.success && response.data) {
        ApiClient.setToken(response.data.token);
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      throw new Error(response.message || 'Login failed');
    } catch (err) {
      setError(err.message || 'Authentication failed');
      return { success: false, error: err.message || 'Authentication failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiClient.post('/auth/verify-otp', { email, otp });
      if (response.success && response.data) {
        ApiClient.setToken(response.data.token);
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      throw new Error(response.message || 'OTP verification failed');
    } catch (err) {
      setError(err.message || 'OTP verification failed');
      return { success: false, error: err.message || 'OTP verification failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email) => {
    try {
      const response = await ApiClient.post('/auth/resend-otp', { email });
      return { success: true, message: response.message };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to resend OTP' };
    }
  };

  const logout = async () => {
    try {
      await ApiClient.post('/auth/logout');
    } catch (err) {
      console.warn('Logout error ignored:', err.message);
    } finally {
      ApiClient.setToken(null);
      setUser(null);
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return user.permissions?.includes(permission);
  };

  const isMasterAdmin = user?.role === 'MASTER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        isMasterAdmin,
        login,
        verifyOtp,
        resendOtp,
        logout,
        hasPermission,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
