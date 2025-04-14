"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserGroupIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDoctors: 0,
    activePatients: 0,
    consultations: 0,
    platformStats: []
  });
  const [recentUsers, setRecentUsers] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users from the file system
        const response = await fetch('/api/admin/dashboard-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        
        // Format platform stats for display
        const platformStats = [
          { 
            name: 'Total Users', 
            value: data.totalUsers.toString(), 
            change: '+15%', // Placeholder for now
            trend: 'up', 
            icon: UserGroupIcon, 
            color: 'bg-blue-500' 
          },
          { 
            name: 'Active Doctors', 
            value: data.activeDoctors.toString(), 
            change: '+8%', // Placeholder for now
            trend: 'up', 
            icon: UserIcon, 
            color: 'bg-green-500' 
          },
          { 
            name: 'Active Patients', 
            value: data.activePatients.toString(), 
            change: '+17%', // Placeholder for now
            trend: 'up', 
            icon: UserGroupIcon, 
            color: 'bg-purple-500' 
          },
          { 
            name: 'Consultations', 
            value: data.consultations.toString(), 
            change: '+23%', // Placeholder for now
            trend: 'up', 
            icon: DocumentTextIcon, 
            color: 'bg-yellow-500' 
          },
        ];
        
        setStats({
          ...data,
          platformStats
        });
        setRecentUsers(data.recentUsers || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  // System alerts (static for now)
  const systemAlerts = [
    { id: 1, title: 'System Update Scheduled', description: 'Maintenance update scheduled for June 20, 2023 at 02:00 UTC.', severity: 'info', date: '2023-06-15' },
    { id: 2, title: 'Database Performance', description: 'Patient records database showing increased query times.', severity: 'warning', date: '2023-06-14' },
    { id: 3, title: 'Storage Capacity Alert', description: 'Medical imaging storage approaching 85% capacity.', severity: 'warning', date: '2023-06-13' },
  ];

  const quickActions = [
    { name: 'User Management', href: '/dashboard/admin/users', icon: UserGroupIcon, color: 'bg-blue-500' },
    { name: 'System Settings', href: '/dashboard/admin/settings', icon: CogIcon, color: 'bg-gray-500' },
    { name: 'Analytics Dashboard', href: '/dashboard/admin/analytics', icon: ChartBarIcon, color: 'bg-green-500' },
    { name: 'Security Management', href: '/dashboard/admin/security', icon: ShieldCheckIcon, color: 'bg-red-500' },
  ];

  return (
    <div>
      {/* Dashboard header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and monitor the ShifaAI platform
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ServerIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            System Status
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <UserGroupIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add New User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          // Loading skeletons for stats
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white pt-5 px-4 pb-5 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-md bg-gray-300 h-12 w-12"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          stats.platformStats?.map((stat) => (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-5 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold text-green-600`}>
                  <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                  <span className="sr-only">Increased by</span>
                  {stat.change}
                </p>
              </dd>
            </div>
          ))
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative rounded-lg p-6 flex flex-col items-center text-center bg-white shadow hover:bg-gray-50 transition-colors"
            >
              <div className={`p-3 rounded-md ${action.color} text-white mb-4`}>
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <span className="text-base font-medium text-gray-900">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="users">Recent Users</option>
            <option value="alerts">System Alerts</option>
            <option value="reports">System Reports</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {[
                { name: 'Recent Users', value: 'users' },
                { name: 'System Alerts', value: 'alerts' },
                { name: 'System Reports', value: 'reports' },
              ].map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.value)}
                  className={`
                    ${activeTab === tab.value
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  `}
                  aria-current={activeTab === tab.value ? 'page' : undefined}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {/* Recent Users Tab Content */}
        {activeTab === 'users' && (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <div className="flex justify-between items-center bg-white px-4 py-3 sm:px-6">
              <h3 className="text-base font-medium text-gray-900">Recent User Registrations</h3>
              <Link
                href="/dashboard/admin/users"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all users
              </Link>
            </div>
            {isLoading ? (
              // Loading skeleton for user table
              <div className="px-4 py-5 sm:p-6">
                <div className="animate-pulse space-y-4">
                  {Array(5).fill(0).map((_, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {user.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.type === 'doctor' 
                              ? 'bg-blue-100 text-blue-800' 
                              : user.type === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {user.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.date}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link href={`/dashboard/admin/users/${user.id}`} className="text-primary-600 hover:text-primary-900 mr-4">
                            View
                          </Link>
                          <button type="button" className="text-primary-600 hover:text-primary-900">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No recent users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* System Alerts Tab Content */}
        {activeTab === 'alerts' && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="flex justify-between items-center px-4 py-3 sm:px-6">
              <h3 className="text-base font-medium text-gray-900">Active System Alerts</h3>
              <Link
                href="/dashboard/admin/alerts"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all alerts
              </Link>
            </div>
            <ul className="divide-y divide-gray-200">
              {systemAlerts.map((alert) => (
                <li key={alert.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-start">
                    <div className={`mt-1 flex-shrink-0 ${
                      alert.severity === 'info' ? 'text-blue-500' : 
                      alert.severity === 'warning' ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {alert.severity === 'info' ? (
                        <InformationCircleIcon className="h-5 w-5" />
                      ) : alert.severity === 'warning' ? (
                        <ExclamationCircleIcon className="h-5 w-5" />
                      ) : (
                        <XCircleIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                        <p className="text-sm text-gray-500">{alert.date}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{alert.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* System Reports Tab Content */}
        {activeTab === 'reports' && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-medium text-gray-900">System Reports</h3>
              <p className="mt-2 text-sm text-gray-500">
                Generate and view reports on system performance, user activity, and more.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-300 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">User Activity Report</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Analysis of user logins, registrations, and active sessions.
                  </p>
                  <button type="button" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Generate Report
                  </button>
                </div>
                <div className="border border-gray-300 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">System Health Report</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Overview of system performance, errors, and bottlenecks.
                  </p>
                  <button type="button" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Icon components 
function ArrowTrendingUpIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function InformationCircleIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

function ExclamationCircleIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );
}

function XCircleIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
} 