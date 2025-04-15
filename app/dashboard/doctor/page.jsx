"use client";

import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import DoctorDashboard from '../../../components/DoctorDashboardContent';
import DashboardLayout from '../../../components/DashboardLayout';

export default function DoctorDashboardPage() {
  const auth = useAuth();
  
  if (!auth || !auth.user) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <DoctorDashboard />
    </DashboardLayout>
  );
} 