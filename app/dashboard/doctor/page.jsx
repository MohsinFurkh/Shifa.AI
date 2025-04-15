"use client";

import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../../components/DashboardLayout';
import DoctorDashboardContent from '../../../components/DoctorDashboardContent';

export default function DoctorDashboardPage() {
  const auth = useAuth();
  
  if (!auth || !auth.user) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <DoctorDashboardContent />
    </DashboardLayout>
  );
} 