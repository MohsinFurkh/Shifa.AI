"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  UserGroupIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ServerIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

// Mock data
const platformStats = [
  { name: 'Total Users', value: '3,921', change: '+15%', trend: 'up', icon: UserGroupIcon, color: 'bg-blue-500' },
  { name: 'Active Doctors', value: '237', change: '+8%', trend: 'up', icon: UserIcon, color: 'bg-green-500' },
  { name: 'Active Patients', value: '3,684', change: '+17%', trend: 'up', icon: UserGroupIcon, color: 'bg-purple-500' },
  { name: 'Consultations', value: '1,245', change: '+23%', trend: 'up', icon: DocumentTextIcon, color: 'bg-yellow-500' },
];

const recentUsers = [
  { id: 1, name: 'Dr. Emily Chen', email: 'emily.chen@example.com', type: 'doctor', status: 'active', date: '2023-06-10' },
  { id: 2, name: 'John Smith', email: 'john.smith@example.com', type: 'patient', status: 'active', date: '2023-06-10' },
  { id: 3, name: 'Dr. Michael Johnson', email: 'michael.johnson@example.com', type: 'doctor', status: 'pending', date: '2023-06-09' },
  { id: 4, name: 'Sarah Williams', email: 'sarah.williams@example.com', type: 'patient', status: 'active', date: '2023-06-09' },
];

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

export default function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState('users');

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
        {platformStats.map((stat) => (
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
              <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                ) : (
                  <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                )}
                <span className="sr-only">{stat.trend === 'up' ? 'Increased' : 'Decreased'} by</span>
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
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
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {user.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        user.type === 'doctor' 
                          ? 'bg-blue-100 text-blue-800' 
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* System Alerts Tab Content */}
        {activeTab === 'alerts' && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="flex justify-between items-center px-4 py-3 sm:px-6">
              <h3 className="text-base font-medium text-gray-900">System Alerts</h3>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Mark All as Read
              </button>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {systemAlerts.map((alert) => (
                <li key={alert.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {alert.severity === 'info' ? (
                        <InformationCircleIcon className="h-6 w-6 text-blue-500" />
                      ) : alert.severity === 'warning' ? (
                        <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                        <p className="text-sm text-gray-500">{alert.date}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{alert.description}</p>
                      <div className="mt-2">
                        <button
                          type="button"
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          View Details
                        </button>
                      </div>
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
              <div className="mt-4 space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-900">System Performance Report</h4>
                    <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                      Good
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Average response time: 0.8s, uptime: 99.98%
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/dashboard/admin/reports/performance"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View full report
                    </Link>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-900">User Activity Report</h4>
                    <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                      Increasing
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    15% increase in active users compared to last month
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/dashboard/admin/reports/user-activity"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View full report
                    </Link>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-900">AI System Accuracy Report</h4>
                    <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                      Excellent
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    AI diagnostic recommendations accuracy: 94.3%
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/dashboard/admin/reports/ai-accuracy"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View full report
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowTrendingDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function InformationCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}

function ExclamationCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}

function XCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
} 