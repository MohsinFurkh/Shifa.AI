"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { 
  ChartBarIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon, 
  HeartIcon, 
  ScaleIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState(null);
  const [medicationAdherence, setMedicationAdherence] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // month, quarter, year

  // Sample data for demo purposes
  const sampleHealthMetrics = {
    weight: {
      current: 75.5,
      previous: 76.2,
      unit: 'kg',
      trend: 'down',
      change: 0.7
    },
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
      unit: 'mmHg',
      status: 'normal'
    },
    heartRate: {
      current: 72,
      unit: 'bpm',
      status: 'normal'
    },
    bloodSugar: {
      current: 5.2,
      unit: 'mmol/L',
      status: 'normal'
    }
  };

  const sampleAppointmentStats = {
    total: 12,
    upcoming: 2,
    past: 9,
    cancelled: 1,
    bySpecialty: [
      { specialty: 'General Physician', count: 5 },
      { specialty: 'Cardiologist', count: 3 },
      { specialty: 'Dermatologist', count: 2 },
      { specialty: 'Pediatrician', count: 1 },
      { specialty: 'Neurologist', count: 1 }
    ],
    byMonth: [
      { month: 'Jan', count: 1 },
      { month: 'Feb', count: 0 },
      { month: 'Mar', count: 2 },
      { month: 'Apr', count: 1 },
      { month: 'May', count: 3 },
      { month: 'Jun', count: 2 },
      { month: 'Jul', count: 3 }
    ]
  };

  const sampleMedicationAdherence = {
    overall: 92,
    byMedication: [
      { name: 'Metformin', adherence: 95 },
      { name: 'Lisinopril', adherence: 90 },
      { name: 'Atorvastatin', adherence: 88 },
      { name: 'Aspirin', adherence: 96 }
    ],
    byMonth: [
      { month: 'Jan', adherence: 88 },
      { month: 'Feb', adherence: 90 },
      { month: 'Mar', adherence: 85 },
      { month: 'Apr', adherence: 92 },
      { month: 'May', adherence: 94 },
      { month: 'Jun', adherence: 95 },
      { month: 'Jul', adherence: 92 }
    ]
  };

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      setHealthMetrics(sampleHealthMetrics);
      setAppointmentStats(sampleAppointmentStats);
      setMedicationAdherence(sampleMedicationAdherence);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-800">Health Analytics</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 'month'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange('quarter')}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 'quarter'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Quarter
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 'year'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Year
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading analytics data...</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Health Metrics */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Health Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <ScaleIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      {healthMetrics.weight.trend === 'down' ? (
                        <ArrowTrendingDownIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowTrendingUpIcon className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mt-2">Weight</h3>
                    <div className="flex items-baseline mt-1">
                      <p className="text-2xl font-bold text-gray-900">{healthMetrics.weight.current}</p>
                      <p className="ml-1 text-gray-500">{healthMetrics.weight.unit}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {healthMetrics.weight.trend === 'down' ? 'Decreased' : 'Increased'} by {Math.abs(healthMetrics.weight.change)} {healthMetrics.weight.unit}
                    </p>
                  </div>

                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-red-100 rounded-full">
                        <HeartIcon className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mt-2">Blood Pressure</h3>
                    <div className="flex items-baseline mt-1">
                      <p className="text-2xl font-bold text-gray-900">
                        {healthMetrics.bloodPressure.systolic}/{healthMetrics.bloodPressure.diastolic}
                      </p>
                      <p className="ml-1 text-gray-500">{healthMetrics.bloodPressure.unit}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 capitalize">{healthMetrics.bloodPressure.status}</p>
                  </div>

                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-green-100 rounded-full">
                        <HeartIcon className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mt-2">Heart Rate</h3>
                    <div className="flex items-baseline mt-1">
                      <p className="text-2xl font-bold text-gray-900">{healthMetrics.heartRate.current}</p>
                      <p className="ml-1 text-gray-500">{healthMetrics.heartRate.unit}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 capitalize">{healthMetrics.heartRate.status}</p>
                  </div>

                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <ChartBarIcon className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mt-2">Blood Sugar</h3>
                    <div className="flex items-baseline mt-1">
                      <p className="text-2xl font-bold text-gray-900">{healthMetrics.bloodSugar.current}</p>
                      <p className="ml-1 text-gray-500">{healthMetrics.bloodSugar.unit}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 capitalize">{healthMetrics.bloodSugar.status}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Statistics */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Appointment Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Appointment Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-primary-50 rounded-lg">
                        <p className="text-3xl font-bold text-primary-600">{appointmentStats.total}</p>
                        <p className="text-sm text-gray-500">Total</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">{appointmentStats.upcoming}</p>
                        <p className="text-sm text-gray-500">Upcoming</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">{appointmentStats.past}</p>
                        <p className="text-sm text-gray-500">Past</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-3xl font-bold text-red-600">{appointmentStats.cancelled}</p>
                        <p className="text-sm text-gray-500">Cancelled</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Appointments by Specialty</h3>
                    <div className="space-y-3">
                      {appointmentStats.bySpecialty.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary-600 h-2.5 rounded-full" 
                              style={{ width: `${(item.count / Math.max(...appointmentStats.bySpecialty.map(s => s.count))) * 100}%` }}
                            ></div>
                          </div>
                          <div className="ml-4 flex justify-between w-32">
                            <span className="text-sm text-gray-600">{item.specialty}</span>
                            <span className="text-sm font-medium text-gray-800">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medication Adherence */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Medication Adherence</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800">Overall Adherence</h3>
                      <div className="flex items-center">
                        <div className="w-16 h-16 relative">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#E5E7EB"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="3"
                              strokeDasharray={`${medicationAdherence.overall}, 100`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-800">{medicationAdherence.overall}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {medicationAdherence.byMedication.map((medication, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full" 
                              style={{ width: `${medication.adherence}%` }}
                            ></div>
                          </div>
                          <div className="ml-4 flex justify-between w-32">
                            <span className="text-sm text-gray-600">{medication.name}</span>
                            <span className="text-sm font-medium text-gray-800">{medication.adherence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Adherence Trend</h3>
                    <div className="h-64 flex items-end space-x-2">
                      {medicationAdherence.byMonth.map((month, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-green-500 rounded-t"
                            style={{ height: `${month.adherence}%` }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-1">{month.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 