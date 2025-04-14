"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
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
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

// Quick action links
const quickActions = [
  { name: 'Health Profile', href: '/dashboard/patient/profile', icon: UserIcon, color: 'bg-pink-500' },
  { name: 'Symptom Checker', href: '/dashboard/patient/symptom-checker', icon: ClipboardDocumentListIcon, color: 'bg-blue-500' },
  { name: 'Book Appointment', href: '/dashboard/patient/appointments', icon: CalendarIcon, color: 'bg-purple-500' },
  { name: 'Chat with Doctor', href: '/dashboard/patient/chat', icon: ChatBubbleBottomCenterTextIcon, color: 'bg-green-500' },
  { name: 'Upload Report', href: '/dashboard/patient/upload-report', icon: DocumentArrowUpIcon, color: 'bg-yellow-500' },
  { name: 'My Records', href: '/dashboard/patient/records', icon: DocumentTextIcon, color: 'bg-indigo-500' },
  { name: 'My Medications', href: '/dashboard/patient/medications', icon: BeakerIcon, color: 'bg-red-500' },
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
  const { user } = useAuth();
  // Add state for health metrics, appointments, and reports
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add state for doctor selection
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDoctorSelection, setShowDoctorSelection] = useState(false);
  
  // Effect to load user data
  useEffect(() => {
    if (user) {
      // Initialize health metrics from user data or empty array
      const metrics = [];
      
      // Add blood pressure if available
      if (user.bloodPressure) {
        metrics.push({
          id: 1,
          name: 'Blood Pressure',
          value: user.bloodPressure,
          status: getBPStatus(user.bloodPressure),
          date: user.lastMetricsUpdate || 'Not updated',
          icon: HeartIcon,
          color: getStatusColor(getBPStatus(user.bloodPressure)),
        });
      }
      
      // Add heart rate if available
      if (user.heartRate) {
        metrics.push({
          id: 2,
          name: 'Heart Rate',
          value: `${user.heartRate} bpm`,
          status: getHeartRateStatus(user.heartRate),
          date: user.lastMetricsUpdate || 'Not updated',
          icon: HeartIcon,
          color: getStatusColor(getHeartRateStatus(user.heartRate)),
        });
      }
      
      // Add glucose level if available
      if (user.glucoseLevel) {
        metrics.push({
          id: 3,
          name: 'Glucose Level',
          value: `${user.glucoseLevel} mg/dL`,
          status: getGlucoseStatus(user.glucoseLevel),
          date: user.lastMetricsUpdate || 'Not updated',
          icon: BeakerIcon,
          color: getStatusColor(getGlucoseStatus(user.glucoseLevel)),
        });
      }
      
      // Add weight if available
      if (user.weight && user.height) {
        const bmi = calculateBMI(user.weight, user.height);
        metrics.push({
          id: 4,
          name: 'Weight & BMI',
          value: `${user.weight} kg (BMI: ${bmi.toFixed(1)})`,
          status: getBMIStatus(bmi),
          date: user.lastMetricsUpdate || 'Not updated',
          icon: UserIcon,
          color: getStatusColor(getBMIStatus(bmi)),
        });
      } else if (user.weight) {
        metrics.push({
          id: 4,
          name: 'Weight',
          value: `${user.weight} kg`,
          status: 'info',
          date: user.lastMetricsUpdate || 'Not updated',
          icon: UserIcon,
          color: 'text-blue-500',
        });
      }
      
      setHealthMetrics(metrics);
      
      // Load appointments if any
      setUpcomingAppointments(user.appointments?.filter(apt => apt.status === 'upcoming') || []);
      
      // Load reports if any
      setRecentReports(user.reports || []);
    }
    
    setLoading(false);
  }, [user]);
  
  // Helper functions for determining health status
  function getBPStatus(bp) {
    const [systolic, diastolic] = bp.split('/').map(Number);
    if (systolic < 120 && diastolic < 80) return 'normal';
    if ((systolic >= 120 && systolic <= 129) && diastolic < 80) return 'elevated';
    return 'high';
  }
  
  function getHeartRateStatus(rate) {
    const hr = Number(rate);
    if (hr >= 60 && hr <= 100) return 'normal';
    if (hr < 60) return 'low';
    return 'high';
  }
  
  function getGlucoseStatus(level) {
    const gl = Number(level);
    if (gl < 100) return 'normal';
    if (gl >= 100 && gl <= 125) return 'elevated';
    return 'high';
  }
  
  function calculateBMI(weightKg, heightCm) {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }
  
  function getBMIStatus(bmi) {
    if (bmi < 18.5) return 'underweight';
    if (bmi >= 18.5 && bmi < 25) return 'normal';
    if (bmi >= 25 && bmi < 30) return 'overweight';
    return 'obese';
  }
  
  function getStatusColor(status) {
    switch (status) {
      case 'normal': return 'text-green-500';
      case 'elevated': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      case 'low': return 'text-yellow-500';
      case 'underweight': return 'text-yellow-500';
      case 'overweight': return 'text-yellow-500';
      case 'obese': return 'text-red-500';
      default: return 'text-blue-500';
    }
  }
  
  // Filter doctors based on search query
  const filteredDoctors = selectedSpecialty 
    ? doctorsBySpecialty[selectedSpecialty]?.filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    : [];

  // Get the user's first name
  const firstName = user?.name?.split(' ')[0] || 'Patient';

  return (
    <div>
      {/* Dashboard header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {firstName}! Here's your health overview.
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
            {loading ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Loading health metrics...</p>
              </div>
            ) : healthMetrics.length > 0 ? (
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
                              metric.status === 'high' ? 'bg-red-100 text-red-800' :
                              metric.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                              metric.status === 'underweight' ? 'bg-yellow-100 text-yellow-800' :
                              metric.status === 'overweight' ? 'bg-yellow-100 text-yellow-800' :
                              metric.status === 'obese' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
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
            ) : (
              <div className="p-8 text-center">
                <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No health metrics available</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add your health metrics like blood pressure, heart rate, and weight to see them here.
                </p>
                <Link
                  href="/dashboard/patient/profile"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Update Health Profile
                </Link>
              </div>
            )}
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
            {loading ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Loading appointments...</p>
              </div>
            ) : upcomingAppointments.length > 0 ? (
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
                          <Link
                            href="/dashboard/patient/appointments"
                            className="rounded bg-primary-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                          >
                            Reschedule
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                <p className="text-sm text-gray-500 mb-4">
                  You don't have any upcoming appointments scheduled. Book one with our healthcare providers.
                </p>
                <Link
                  href="/dashboard/patient/appointments"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Book Appointment
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent medical reports */}
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
          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Loading reports...</p>
            </div>
          ) : recentReports.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-200">
              {recentReports.map((report) => (
                <li key={report.id}>
                  <Link href={`/dashboard/patient/records/${report.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-primary-600">{report.name}</p>
                        <div className="ml-2 flex flex-shrink-0">
                          <p className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                            {report.type}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {report.date}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                          <p>View Report</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medical reports</h3>
              <p className="text-sm text-gray-500 mb-4">
                No medical reports have been uploaded to your account yet.
              </p>
              <Link
                href="/dashboard/patient/upload-report"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                Upload Report
              </Link>
            </div>
          )}
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