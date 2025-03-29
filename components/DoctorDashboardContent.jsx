"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  UserIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';

// Mock data
const upcomingAppointments = [
  { 
    id: 1, 
    patient: 'John Smith', 
    age: 45, 
    date: '2023-06-15', 
    time: '10:00 AM', 
    type: 'Follow-up',
    status: 'confirmed',
    complaint: 'Chest pain, shortness of breath'
  },
  { 
    id: 2, 
    patient: 'Emily Johnson', 
    age: 32, 
    date: '2023-06-15', 
    time: '11:30 AM', 
    type: 'New Patient',
    status: 'confirmed',
    complaint: 'Migraine, dizziness'
  },
  { 
    id: 3, 
    patient: 'Michael Rodriguez', 
    age: 58, 
    date: '2023-06-15', 
    time: '2:15 PM', 
    type: 'Follow-up',
    status: 'confirmed',
    complaint: 'Post-surgery check-up'
  },
];

const recentPatients = [
  { id: 1, name: 'James Wilson', age: 67, lastVisit: '2023-06-10', condition: 'Hypertension, Diabetes' },
  { id: 2, name: 'Sarah Thompson', age: 42, lastVisit: '2023-06-08', condition: 'Asthma' },
  { id: 3, name: 'Robert Garcia', age: 35, lastVisit: '2023-06-05', condition: 'Anxiety, Insomnia' },
  { id: 4, name: 'Jennifer Lee', age: 29, lastVisit: '2023-06-01', condition: 'Migraine' },
];

const doctorStats = [
  { name: 'Patients Seen Today', value: 8, icon: UserGroupIcon, color: 'bg-blue-500' },
  { name: 'Pending Reports', value: 3, icon: DocumentTextIcon, color: 'bg-yellow-500' },
  { name: 'Upcoming Appointments', value: 12, icon: CalendarIcon, color: 'bg-green-500' },
  { name: 'Messages', value: 5, icon: ChatBubbleLeftRightIcon, color: 'bg-purple-500' },
];

const aiInsights = [
  {
    id: 1,
    title: 'Potential Diagnosis Match',
    description: 'Patient John Smith\'s symptoms and test results show patterns consistent with early-stage coronary artery disease.',
    confidence: 'high',
    patientId: 1,
  },
  {
    id: 2,
    title: 'Treatment Recommendation',
    description: 'Based on recent guidelines and patient Sarah Thompson\'s medical history, consider adjusting current asthma medication.',
    confidence: 'medium',
    patientId: 2,
  },
  {
    id: 3,
    title: 'Test Recommendation',
    description: 'For patient Robert Garcia, recommend sleep study to better assess insomnia patterns and potential sleep apnea.',
    confidence: 'high',
    patientId: 3,
  },
];

const quickActions = [
  { name: 'Add Patient', href: '/dashboard/doctor/patients/add', icon: UserIcon, color: 'bg-blue-500' },
  { name: 'Schedule Appointment', href: '/dashboard/doctor/appointments/schedule', icon: CalendarIcon, color: 'bg-green-500' },
  { name: 'Upload Report', href: '/dashboard/doctor/upload-report', icon: DocumentArrowUpIcon, color: 'bg-yellow-500' },
  { name: 'View Reports', href: '/dashboard/doctor/reports', icon: DocumentTextIcon, color: 'bg-orange-500' },
  { name: 'Message Patients', href: '/dashboard/doctor/messages', icon: ChatBubbleLeftRightIcon, color: 'bg-purple-500' },
];

const patientRequests = [
  { 
    id: 1, 
    patientName: 'Maria Wilson', 
    age: 35, 
    gender: 'Female',
    requestType: 'New Patient', 
    requestDate: '2023-06-14',
    reason: 'Chronic migraines, seeking specialist care after medication failure',
    status: 'pending'
  },
  { 
    id: 2, 
    patientName: 'Thomas Clark', 
    age: 62, 
    gender: 'Male',
    requestType: 'New Patient', 
    requestDate: '2023-06-13',
    reason: 'Unusual heart palpitations and shortness of breath',
    status: 'pending'
  },
  { 
    id: 3, 
    patientName: 'Sophia Martinez', 
    age: 28, 
    gender: 'Female',
    requestType: 'Second Opinion', 
    requestDate: '2023-06-12',
    reason: 'Seeking second opinion on thyroid condition diagnosis',
    status: 'pending'
  },
];

export default function DoctorDashboardContent() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      {/* Dashboard header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, Dr. Johnson! You have <span className="font-medium text-primary-600">{upcomingAppointments.length}</span> appointments today.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <BellIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Notifications
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <CalendarIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {doctorStats.map((stat) => (
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
            </dd>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-50 transition-colors"
            >
              <div className={`p-3 rounded-md ${action.color} text-white mb-4`}>
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <span className="text-base font-medium text-gray-900">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's appointments */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Today's Appointments</h2>
          <Link
            href="/dashboard/doctor/appointments"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Patient
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Time
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Complaint
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {upcomingAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{appointment.patient}</div>
                        <div className="text-gray-500">{appointment.age} years old</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="font-medium">{appointment.time}</div>
                    <div>{appointment.date}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      appointment.type === 'New Patient' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {appointment.type}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">{appointment.complaint}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link href={`/dashboard/doctor/patients/${appointment.id}`} className="text-primary-600 hover:text-primary-900 mr-4">
                      View
                    </Link>
                    <button type="button" className="text-primary-600 hover:text-primary-900">
                      Start
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Requests */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Patient Requests</h2>
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
            {patientRequests.length} New
          </span>
        </div>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Patient
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Request Type
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Reason
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
              {patientRequests.map((request) => (
                <tr key={request.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{request.patientName}</div>
                        <div className="text-gray-500">{request.age} years, {request.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      request.requestType === 'New Patient' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {request.requestType}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">
                      {request.reason}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {request.requestDate}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button 
                      type="button" 
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Accept
                    </button>
                    <button 
                      type="button" 
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Search */}
      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Patient Search</h2>
          <p className="mt-1 text-sm text-gray-600">
            Search for patients by name, ID, or condition
          </p>
        </div>
        <div className="mt-4 flex rounded-md shadow-sm max-w-lg">
          <div className="relative flex flex-grow items-stretch">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center rounded-r-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            Search
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-900">Recent Patients</h3>
          <ul role="list" className="divide-y divide-gray-200 mt-3">
            {recentPatients.map((patient) => (
              <li key={patient.id} className="py-4 flex hover:bg-gray-50 px-4 cursor-pointer rounded-md">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">{patient.age} years old</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Condition: {patient.condition}</p>
                    <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">AI Clinical Insights</h2>
        <div className="space-y-4">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="rounded-md bg-primary-100 p-3">
                      <LightBulbIcon className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-base font-medium text-gray-900">{insight.title}</h3>
                      <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        insight.confidence === 'high' ? 'bg-green-100 text-green-800' : 
                        insight.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {insight.confidence} confidence
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {insight.description}
                    </p>
                    <div className="mt-4 flex">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        Review Details
                      </button>
                      <button
                        type="button"
                        className="ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        View Patient Record
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LightBulbIcon(props) {
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
        d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
      />
    </svg>
  );
} 