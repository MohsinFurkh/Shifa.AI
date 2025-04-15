"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '/contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
// ... existing code ...

export default function AdminUsersPage() {
  const auth = useAuth();
  // ... existing code ...

  if (!auth || !auth.user) {
    return null;
  }

  // ... rest of the component ...
} 