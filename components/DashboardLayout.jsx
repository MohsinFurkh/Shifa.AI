"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const userTypeNavigation = {
  patient: [
    { name: 'Dashboard', href: '/dashboard/patient', icon: HomeIcon },
    { name: 'Health Profile', href: '/dashboard/patient/profile', icon: UserIcon },
    { name: 'Symptom Checker', href: '/dashboard/patient/symptom-checker', icon: ClipboardDocumentListIcon },
    { name: 'Medical Records', href: '/dashboard/patient/records', icon: DocumentTextIcon },
    { name: 'Consultations', href: '/dashboard/patient/consultations', icon: ChatBubbleLeftRightIcon },
    { name: 'Analytics', href: '/dashboard/patient/analytics', icon: ChartBarIcon },
  ],
  doctor: [
    { name: 'Dashboard', href: '/dashboard/doctor', icon: HomeIcon },
    { name: 'Profile', href: '/dashboard/doctor/profile', icon: UserIcon },
    { name: 'Patients', href: '/dashboard/doctor/patients', icon: UserGroupIcon },
    { name: 'Consultations', href: '/dashboard/doctor/consultations', icon: ChatBubbleLeftRightIcon },
    { name: 'AI Analysis', href: '/dashboard/doctor/ai-analysis', icon: DocumentTextIcon },
    { name: 'Analytics', href: '/dashboard/doctor/analytics', icon: ChartBarIcon },
  ],
  admin: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: HomeIcon },
    { name: 'Users', href: '/dashboard/admin/users', icon: UserGroupIcon },
    { name: 'Reports', href: '/dashboard/admin/reports', icon: DocumentTextIcon },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: CogIcon },
  ],
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // If user is not logged in, show loading state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get the user type and enforce access control
  const userType = user.type;
  
  // Check if user is on the correct dashboard type
  const dashboardPrefix = `/dashboard/${userType}`;
  if (!pathname.startsWith(dashboardPrefix)) {
    // If not on the correct dashboard, redirect and show nothing
    router.push(dashboardPrefix);
    return null;
  }

  const navigation = userTypeNavigation[userType] || [];
  
  // Use either the authenticated user or our test user
  const activeUser = user;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-40 flex">
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-2xl font-bold text-primary-600">ShifaAI</span>
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto">
              <nav className="space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    logout();
                    setSidebarOpen(false);
                  }}
                  className="group flex w-full items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <ArrowLeftOnRectangleIcon className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <Link href={`/dashboard/${userType}`} className="text-2xl font-bold text-primary-600">ShifaAI</Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                      >
                        <item.icon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary-600" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  onClick={logout}
                  className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary-600" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <Link 
                  href={`/dashboard/${userType}/profile`} 
                  className="flex items-center gap-x-4 text-sm font-semibold leading-6 text-gray-900"
                >
                  <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : userType === 'patient' ? 'P' : userType === 'doctor' ? 'D' : 'A'}
                  </span>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                      {activeUser.name || (userType === 'patient' ? 'Patient' : userType === 'doctor' ? 'Doctor' : 'Admin')}
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 