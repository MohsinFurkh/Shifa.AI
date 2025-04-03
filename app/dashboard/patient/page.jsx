"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    medications: 0,
    recentReports: 0
  });

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setStats({
        upcomingAppointments: 2,
        medications: 3,
        recentReports: 1
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name || 'Patient'}</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your health information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">📅</div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
              <p className="text-3xl font-bold text-indigo-600">{stats.upcomingAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">💊</div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">Active Medications</h2>
              <p className="text-3xl font-bold text-indigo-600">{stats.medications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">📋</div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
              <p className="text-3xl font-bold text-indigo-600">{stats.recentReports}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition">
            Book Appointment
          </button>
          <button className="p-4 border border-gray-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition">
            Message Doctor
          </button>
          <button className="p-4 border border-gray-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition">
            View Health Records
          </button>
        </div>
      </div>
    </div>
  );
} 