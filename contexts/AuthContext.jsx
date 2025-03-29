"use client";

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Create authentication context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if there's an existing user session in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('shifaai_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('shifaai_user', JSON.stringify(userData));
    
    // Redirect based on user type
    if (userData.type === 'patient') {
      router.push('/dashboard/patient');
    } else if (userData.type === 'doctor') {
      router.push('/dashboard/doctor');
    } else if (userData.type === 'admin') {
      router.push('/dashboard/admin');
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('shifaai_user');
    router.push('/');
  };

  // Update user profile
  const updateProfile = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('shifaai_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 