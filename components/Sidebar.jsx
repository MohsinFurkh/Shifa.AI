"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // On initial mount or when user changes, set role
    if (user) {
      setUserRole(user.role);
    } else {
      // Check localStorage as a fallback
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setUserRole(decoded.role);
        } catch (e) {
          console.error('Error decoding token:', e);
        }
      }
    }
  }, [user]);

  // Define navigation links based on user role
  const getNavLinks = () => {
    const navLinks = {
      patient: [
        { href: '/dashboard/patient', label: 'Dashboard', icon: '📊' },
        { href: '/dashboard/patient/appointments', label: 'Appointments', icon: '📅' },
        { href: '/dashboard/patient/consultations', label: 'Consultations', icon: '👨‍⚕️' },
        { href: '/dashboard/patient/records', label: 'Medical Records', icon: '📋' },
        { href: '/dashboard/patient/medications', label: 'Medications', icon: '💊' },
        { href: '/dashboard/patient/analytics', label: 'Health Analytics', icon: '📈' },
        { href: '/dashboard/patient/chat', label: 'Chat with Doctor', icon: '💬' },
        { href: '/dashboard/patient/profile', label: 'Profile', icon: '👤' },
      ],
      doctor: [
        { href: '/dashboard/doctor', label: 'Dashboard', icon: '📊' },
        { href: '/dashboard/doctor/appointments', label: 'Appointments', icon: '📅' },
        { href: '/dashboard/doctor/patients', label: 'My Patients', icon: '👨‍👩‍👧‍👦' },
        { href: '/dashboard/doctor/upload-report', label: 'Upload Reports', icon: '📤' },
        { href: '/dashboard/doctor/profile', label: 'Profile', icon: '👤' },
      ],
      admin: [
        { href: '/dashboard/admin', label: 'Dashboard', icon: '📊' },
        { href: '/dashboard/admin/users', label: 'Manage Users', icon: '👥' },
        { href: '/dashboard/admin/doctors', label: 'Manage Doctors', icon: '👨‍⚕️' },
        { href: '/dashboard/admin/reports', label: 'Reports', icon: '📊' },
        { href: '/dashboard/admin/profile', label: 'Profile', icon: '👤' },
      ]
    };

    return navLinks[userRole] || navLinks.patient;
  };

  const links = getNavLinks();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="py-6 px-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'} Portal
          </h2>
        </div>
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                pathname === link.href
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
} 