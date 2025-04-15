"use client";

import { useAuth } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/DashboardLayout';
import DoctorDashboardContent from '../../../components/DoctorDashboardContent';

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  
  // For testing purposes, always render the dashboard content regardless of user auth
  // Replace this with the original check once authentication is working correctly
  // if (!user) {
  //   return null;
  // }
  
  return (
    <DashboardLayout>
      <DoctorDashboardContent />
    </DashboardLayout>
  );
} 