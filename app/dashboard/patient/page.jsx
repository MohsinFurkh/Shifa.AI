"use client";

import { useAuth } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/DashboardLayout';
import PatientDashboardContent from '../../../components/PatientDashboardContent';

export default function PatientDashboardPage() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <PatientDashboardContent />
    </DashboardLayout>
  );
} 