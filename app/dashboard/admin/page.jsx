"use client";

import { useAuth } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/DashboardLayout';
import AdminDashboardContent from '../../../components/AdminDashboardContent';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <AdminDashboardContent />
    </DashboardLayout>
  );
} 