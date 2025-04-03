"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { CalendarDaysIcon, ClockIcon, UserIcon, BellIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data for demo purposes
  const sampleAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Ahmed',
      specialty: 'General Physician',
      date: '2023-07-15',
      time: '10:00 AM',
      status: 'upcoming',
      reason: 'Annual check-up',
    },
    {
      id: 2,
      doctor: 'Dr. Khalid Khan',
      specialty: 'Cardiologist',
      date: '2023-07-20',
      time: '02:30 PM',
      status: 'upcoming',
      reason: 'Follow-up consultation',
    },
  ];

  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      // Filter out cancelled appointments
      const activeAppointments = sampleAppointments.filter(app => app.status === 'upcoming');
      setUpcomingAppointments(activeAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome, {user.name}</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <CalendarDaysIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-gray-800">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <UserIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">My Doctors</p>
                <p className="text-2xl font-bold text-gray-800">3</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <BellIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Notifications</p>
                <p className="text-2xl font-bold text-gray-800">2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 bg-primary-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary-800">Upcoming Appointments</h2>
            <a 
              href="/dashboard/patient/appointments" 
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              View All
            </a>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading appointments...</p>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-medium text-gray-800">{appointment.doctor}</h3>
                        <p className="text-gray-600">{appointment.specialty}</p>
                        <p className="text-gray-600 mt-2">{appointment.reason}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center text-gray-600">
                          <CalendarDaysIcon className="h-5 w-5 mr-2 text-primary-600" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <ClockIcon className="h-5 w-5 mr-2 text-primary-600" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <a 
                        href={`/dashboard/patient/appointments?action=reschedule&id=${appointment.id}`}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition mr-2"
                      >
                        Reschedule
                      </a>
                      <a 
                        href={`/dashboard/patient/appointments?action=cancel&id=${appointment.id}`}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                      >
                        Cancel
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 flex flex-col items-center justify-center">
                <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">No upcoming appointments found</p>
                <a 
                  href="/dashboard/patient/appointments" 
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                >
                  Book Appointment
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100">
            <h2 className="text-xl font-bold text-primary-800">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-full">
                  <CalendarDaysIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-800">Appointment Scheduled</p>
                  <p className="text-sm text-gray-500">You scheduled an appointment with Dr. Sarah Ahmed for July 15, 2023</p>
                  <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-800">New Doctor Added</p>
                  <p className="text-sm text-gray-500">Dr. Khalid Khan was added to your care team</p>
                  <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <BellIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-800">Appointment Reminder</p>
                  <p className="text-sm text-gray-500">Reminder: You have an appointment with Dr. Ayesha Malik tomorrow</p>
                  <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 