"use client";

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Create authentication context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Check routing based on user type
  useEffect(() => {
    // Only run after initial load
    if (loading) return;
    
    // If no user and on a protected route, redirect to login
    if (!user && pathname !== '/' && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
      return;
    }

    // If logged in user is on the wrong dashboard type
    if (user) {
      const inPatientDashboard = pathname.startsWith('/dashboard/patient');
      const inDoctorDashboard = pathname.startsWith('/dashboard/doctor');
      const inAdminDashboard = pathname.startsWith('/dashboard/admin');
      
      // Redirect if wrong dashboard
      if (user.type === 'patient' && (inDoctorDashboard || inAdminDashboard)) {
        router.push('/dashboard/patient');
      } else if (user.type === 'doctor' && (inPatientDashboard || inAdminDashboard)) {
        router.push('/dashboard/doctor');
      } else if (user.type === 'admin' && (inPatientDashboard || inDoctorDashboard)) {
        router.push('/dashboard/admin');
      }
    }
  }, [user, loading, pathname, router]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/login';
  };

  const updateProfile = (updatedData) => {
    // Get the latest user data from localStorage
    const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Create updated user object
    const updatedUser = {
      ...currentUserData,
      ...updatedData
    };
    
    // Update state and localStorage
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  // Get the auth token
  const getToken = () => {
    return user?.token;
  };

  // Function to make authenticated API requests
  const authFetch = async (url, options = {}) => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle token expiration
    if (response.status === 401) {
      logout();
      throw new Error('Your session has expired. Please login again.');
    }

    return response;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateProfile, 
      loading,
      getToken,
      authFetch 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 