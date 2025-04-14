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
    // Make sure we have the token
    if (!userData.token) {
      console.error('Login failed: No token provided');
      return;
    }

    // Check if we have existing stored data for this user to preserve
    let existingUserData = {};
    const storedUser = localStorage.getItem('shifaai_user');
    
    if (storedUser) {
      try {
        const parsedData = JSON.parse(storedUser);
        // Only use stored data if it's for the same user
        if (parsedData.email === userData.email && 
            (parsedData.id === userData.id || parsedData._id === userData._id)) {
          // Extract health metrics and other data we want to preserve
          const { 
            bloodPressure, heartRate, glucoseLevel, weight, height,
            lastMetricsUpdate, healthHistory, appointments, reports,
            medications, allergies
          } = parsedData;
          
          // Add these properties to our object if they exist
          existingUserData = {
            ...(bloodPressure && { bloodPressure }),
            ...(heartRate && { heartRate }),
            ...(glucoseLevel && { glucoseLevel }),
            ...(weight && { weight }),
            ...(height && { height }),
            ...(lastMetricsUpdate && { lastMetricsUpdate }),
            ...(healthHistory && { healthHistory }),
            ...(appointments && { appointments }),
            ...(reports && { reports }),
            ...(medications && { medications }),
            ...(allergies && { allergies })
          };
        }
      } catch (e) {
        console.error("Error parsing stored user data during login", e);
      }
    }
    
    // Save user data with token, preserving existing health data
    const userWithToken = {
      ...userData,
      ...existingUserData  // Merge existing data with new login data
    };
    
    setUser(userWithToken);
    localStorage.setItem('shifaai_user', JSON.stringify(userWithToken));
    
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
    try {
      // Get the latest stored user data first to ensure we have the most up-to-date data
      const storedUser = localStorage.getItem('shifaai_user');
      let currentUserData = user;
      
      if (storedUser) {
        try {
          const parsedData = JSON.parse(storedUser);
          // Only use stored data if it's for the current user
          if (parsedData.email === user.email && parsedData.id === user.id) {
            currentUserData = parsedData;
          }
        } catch (e) {
          console.error("Error parsing stored user data", e);
        }
      }
      
      // Create a new user object with the updated data
      const updatedUser = { 
        ...currentUserData, 
        ...newUserData,
        // Always preserve token to maintain authentication
        token: user.token
      };
      
      // Update state and localStorage
      setUser(updatedUser);
      localStorage.setItem('shifaai_user', JSON.stringify(updatedUser));
      
      // Log success message
      console.log("Profile updated successfully", updatedUser);
      
      return true;
    } catch (error) {
      console.error("Error updating profile", error);
      return false;
    }
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
};

export default AuthContext; 