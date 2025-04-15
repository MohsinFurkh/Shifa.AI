"use client";

import { useAuth } from '/contexts/AuthContext';
import DashboardLayout from '../../../components/DashboardLayout';
import UserDashboardContent from '../../../components/UserDashboardContent';

export default function UserDashboardPage() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <UserDashboardContent />
    </DashboardLayout>
  );
} 
