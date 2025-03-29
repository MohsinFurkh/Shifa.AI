"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  HeartIcon,
  BeakerIcon,
  UserIcon,
  DocumentArrowUpIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  UserPlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Mock data
const upcomingAppointments = [
  { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: '2023-06-15', time: '10:00 AM' },
  { id: 2, doctor: 'Dr. Michael Lee', specialty: 'Dermatologist', date: '2023-06-20', time: '2:30 PM' },
];

const recentReports = [
  { id: 1, name: 'Blood Test Results', date: '2023-05-28', type: 'Laboratory' },
  { id: 2, name: 'Chest X-Ray', date: '2023-05-15', type: 'Radiology' },
  { id: 3, name: 'Echocardiogram', date: '2023-04-30', type: 'Cardiology' },
];

const quickActions = [
  { name: 'Health Profile', href: '/dashboard/patient/profile', icon: UserIcon, color: 'bg-pink-500' },
  { name: 'Symptom Checker', href: '/dashboard/patient/symptom-checker', icon: ClipboardDocumentListIcon, color: 'bg-blue-500' },
  { name: 'Book Appointment', href: '/dashboard/patient/appointments', icon: CalendarIcon, color: 'bg-purple-500' },
  { name: 'Chat with Doctor', href: '/dashboard/patient/chat', icon: ChatBubbleBottomCenterTextIcon, color: 'bg-green-500' },
  { name: 'Upload Report', href: '/dashboard/patient/upload-report', icon: DocumentArrowUpIcon, color: 'bg-yellow-500' },
  { name: 'My Records', href: '/dashboard/patient/records', icon: DocumentTextIcon, color: 'bg-indigo-500' },
  { name: 'My Medications', href: '/dashboard/patient/medications', icon: BeakerIcon, color: 'bg-red-500' },
];

const healthMetrics = [
  {
    id: 1,
    name: 'Blood Pressure',
    value: '120/80',
    status: 'normal',
    date: '2 days ago',
    icon: HeartIcon,
    color: 'text-green-500',
  },
  {
    id: 2,
    name: 'Heart Rate',
    value: '72 bpm',
    status: 'normal',
    date: '2 days ago',
    icon: HeartIcon,
    color: 'text-green-500',
  },
  {
    id: 3,
    name: 'Glucose Level',
    value: '110 mg/dL',
    status: 'elevated',
    date: '3 days ago',
    icon: BeakerIcon,
    color: 'text-yellow-500',
  },
  {
    id: 4,
    name: 'Weight',
    value: '68 kg',
    status: 'normal',
    date: '1 week ago',
    icon: UserIcon,
    color: 'text-green-500',
  },
];

// Mock data for doctors by specialty
const doctorSpecialties = [
  { id: 'neurologist', name: 'Neurologist', description: 'Brain, spinal cord, and nervous system specialists' },
  { id: 'cardiologist', name: 'Cardiologist', description: 'Heart and cardiovascular system specialists' },
  { id: 'dermatologist', name: 'Dermatologist', description: 'Skin, hair, and nail specialists' },
  { id: 'oncologist', name: 'Oncologist', description: 'Cancer specialists' },
  { id: 'psychiatrist', name: 'Psychiatrist', description: 'Mental health specialists' },
  { id: 'obgyn', name: 'Obstetrics & Gynaecology', description: 'Women\'s reproductive health specialists' },
  { id: 'ophthalmologist', name: 'Ophthalmologist', description: 'Eye and vision specialists' },
  { id: 'endocrinologist', name: 'Endocrinologist', description: 'Hormone and metabolism specialists' },
  { id: 'gastroenterologist', name: 'Gastroenterologist', description: 'Digestive system specialists' },
  { id: 'orthopedist', name: 'Orthopaedist', description: 'Bone and joint specialists' },
  { id: 'radiologist', name: 'Radiologist', description: 'Medical imaging specialists' },
];

// Mock doctors data
const doctorsBySpecialty = {
  neurologist: [
    { id: 101, name: 'Dr. Sarah Johnson', experience: '12 years', rating: 4.8, available: true },
    { id: 102, name: 'Dr. Michael Chen', experience: '8 years', rating: 4.6, available: true },
    { id: 103, name: 'Dr. Emily Rodriguez', experience: '15 years', rating: 4.9, available: false },
  ],
  cardiologist: [
    { id: 201, name: 'Dr. Robert Smith', experience: '20 years', rating: 4.9, available: true },
    { id: 202, name: 'Dr. Jennifer Davis', experience: '11 years', rating: 4.7, available: true },
    { id: 203, name: 'Dr. William Jones', experience: '14 years', rating: 4.5, available: true },
  ],
  dermatologist: [
    { id: 301, name: 'Dr. Lisa Williams', experience: '9 years', rating: 4.8, available: true },
    { id: 302, name: 'Dr. David Kim', experience: '13 years', rating: 4.9, available: false },
  ],
  // Add more doctors for other specialties as needed
};

export default function PatientDashboardContent() {
  // Add state for doctor selection
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDoctorSelection, setShowDoctorSelection] = useState(false);
  
  // Filter doctors based on search query
  const filteredDoctors = selectedSpecialty 
    ? doctorsBySpecialty[selectedSpecialty]?.filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    : [];

  return (
    <div>
      {/* Dashboard header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, John! Here's your health overview.
        </p>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative rounded-lg p-4 flex flex-col items-center text-center hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-full ${action.color} text-white mb-3`}>
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-gray-900">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Health metrics */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Health Metrics</h2>
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {healthMetrics.map((metric) => (
                <li key={metric.id}>
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">
                        <metric.icon className={`h-10 w-10 ${metric.color}`} aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <p className="text-sm font-medium text-gray-900">{metric.name}</p>
                        <div className="flex items-center">
                          <p className="truncate text-sm text-gray-500">{metric.value}</p>
                          <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            metric.status === 'normal' ? 'bg-green-100 text-green-800' : 
                            metric.status === 'elevated' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {metric.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Last updated</p>
                      <p>{metric.date}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Upcoming appointments */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
            <Link
              href="/dashboard/patient/appointments"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            {upcomingAppointments.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary-600">{appointment.doctor}</p>
                        <div className="flex flex-shrink-0 ml-2">
                          <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            {appointment.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                          <p className="flex items-center text-sm text-gray-500">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <button
                            type="button"
                            className="rounded bg-primary-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                          >
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                <p>No upcoming appointments.</p>
                <button
                  type="button"
                  className="mt-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Book Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Medical Reports */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Medical Reports</h2>
          <Link
            href="/dashboard/patient/records"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          {recentReports.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-200">
              {recentReports.map((report) => (
                <li key={report.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary-600">{report.name}</p>
                      <div className="flex flex-shrink-0 ml-2">
                        <p className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                          {report.type}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                        <p className="flex items-center text-sm text-gray-500">
                          Uploaded on {report.date}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <button
                          type="button"
                          className="rounded bg-primary-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        >
                          View Report
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              <p>No medical reports available.</p>
              <Link
                href="/dashboard/patient/upload-report"
                className="mt-2 inline-block rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Upload Report
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Find a Doctor */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Find a Doctor</h2>
          <button
            onClick={() => setShowDoctorSelection(!showDoctorSelection)}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            {showDoctorSelection ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {showDoctorSelection && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-base font-medium text-gray-900 mb-2">Select a Specialty</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {doctorSpecialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    onClick={() => setSelectedSpecialty(specialty.id)}
                    className={`px-3 py-2 rounded text-sm font-medium ${
                      selectedSpecialty === specialty.id
                        ? 'bg-primary-100 text-primary-800 ring-1 ring-primary-500'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {specialty.name}
                  </button>
                ))}
              </div>
            </div>
            
            {selectedSpecialty && (
              <div className="p-4">
                <div className="mb-4">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search doctors by name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <h3 className="text-base font-medium text-gray-900 mb-3">
                  {doctorSpecialties.find(s => s.id === selectedSpecialty)?.name} Doctors
                </h3>
                
                {filteredDoctors.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredDoctors.map((doctor) => (
                      <li key={doctor.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{doctor.name}</p>
                              <div className="flex items-center">
                                <p className="text-sm text-gray-500 mr-2">Experience: {doctor.experience}</p>
                                <p className="text-sm text-gray-500">Rating: {doctor.rating}/5</p>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={!doctor.available}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm ${
                              doctor.available
                                ? 'text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <UserPlusIcon className="mr-1 h-4 w-4" />
                            {doctor.available ? 'Request Appointment' : 'Unavailable'}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No doctors found. Try another specialty or search term.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Health Insights */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">AI Health Insights</h2>
        <div className="bg-white p-6 shadow sm:rounded-lg">
          <h3 className="text-base font-medium text-gray-900">Your Health Recommendations</h3>
          <div className="mt-5 border-t border-gray-200 pt-5">
            <div className="flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                <li className="py-5">
                  <div className="relative">
                    <h4 className="text-sm font-semibold text-gray-800">Based on your blood pressure readings</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Your blood pressure readings have been stable. Continue monitoring regularly and maintain your healthy lifestyle.
                    </p>
                  </div>
                </li>
                <li className="py-5">
                  <div className="relative">
                    <h4 className="text-sm font-semibold text-gray-800">Glucose level recommendation</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Your glucose levels are slightly elevated. Consider reducing your intake of refined sugars and increasing physical activity.
                    </p>
                  </div>
                </li>
                <li className="py-5">
                  <div className="relative">
                    <h4 className="text-sm font-semibold text-gray-800">General health reminder</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      It's been over a year since your last full checkup. Consider scheduling an appointment with your primary care physician.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Link
                href="/dashboard/patient/health-plan"
                className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary-600 shadow-sm ring-1 ring-inset ring-primary-300 hover:bg-gray-50"
              >
                View your personalized health plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrainIcon(props) {
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
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  );
} 