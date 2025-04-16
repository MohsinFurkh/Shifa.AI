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
  ArrowTrendingDownIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState(null);
  const [medicationAdherence, setMedicationAdherence] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // month, quarter, year
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      setError(null);
      
      try {
        // Try to get the most up-to-date data
        let userData = user;
        const storedUserData = localStorage.getItem('shifaai_user');
        
        if (storedUserData) {
          try {
            const parsedData = JSON.parse(storedUserData);
            // Use localStorage data if it's for the current user
            if (parsedData.email === user.email && parsedData.id === user.id) {
              userData = parsedData;
            }
          } catch (e) {
            console.error("Error parsing stored user data", e);
          }
        }
        
        // Get user ID
        const userId = userData._id || userData.id;
        
        // Fetch health metrics
        const healthResponse = await fetch(`/api/patient/get-health-metrics?userId=${userId}`);
        let healthData = null;
        
        if (healthResponse.ok) {
          const responseData = await healthResponse.json();
          healthData = responseData.data;
        }
        
        // Fetch appointments
        const appointmentsResponse = await fetch(`/api/patient/appointments?userId=${userId}`);
        let appointmentsData = [];
        
        if (appointmentsResponse.ok) {
          const responseData = await appointmentsResponse.json();
          appointmentsData = responseData.data || [];
        }
        
        // Fetch medications (can be added in the future)
        // For now, we'll use a simple calculation based on existing data
        
        // Process health data
        if (healthData && healthData.current) {
          const currentData = healthData.current;
          const previousData = healthData.previous || {};
          
          // Format health metrics
          const processedHealthMetrics = {
    weight: {
              current: currentData.weight || 0,
              previous: previousData.weight || 0,
      unit: 'kg',
              trend: (currentData.weight || 0) < (previousData.weight || 0) ? 'down' : 'up',
              change: Math.abs((currentData.weight || 0) - (previousData.weight || 0)).toFixed(1)
    },
    bloodPressure: {
              systolic: parseInt(currentData.bloodPressure?.split('/')[0]) || 120,
              diastolic: parseInt(currentData.bloodPressure?.split('/')[1]) || 80,
      unit: 'mmHg',
              status: getBPStatus(currentData.bloodPressure || '120/80')
    },
    heartRate: {
              current: currentData.heartRate || 0,
      unit: 'bpm',
              status: getHeartRateStatus(currentData.heartRate || 0)
    },
    bloodSugar: {
              current: currentData.glucoseLevel || 0,
              unit: 'mg/dL',
              status: getGlucoseStatus(currentData.glucoseLevel || 0)
    }
  };

          setHealthMetrics(processedHealthMetrics);
        } else {
          // Fallback to user data or empty values
          const fallbackHealthMetrics = {
            weight: {
              current: userData.weight || 0,
              previous: userData.previousWeight || 0,
              unit: 'kg',
              trend: (userData.weight || 0) < (userData.previousWeight || 0) ? 'down' : 'up',
              change: Math.abs((userData.weight || 0) - (userData.previousWeight || 0)).toFixed(1)
            },
            bloodPressure: {
              systolic: parseInt(userData.bloodPressure?.split('/')[0]) || 120,
              diastolic: parseInt(userData.bloodPressure?.split('/')[1]) || 80,
              unit: 'mmHg',
              status: getBPStatus(userData.bloodPressure || '120/80')
            },
            heartRate: {
              current: userData.heartRate || 0,
              unit: 'bpm',
              status: getHeartRateStatus(userData.heartRate || 0)
            },
            bloodSugar: {
              current: userData.glucoseLevel || 0,
              unit: 'mg/dL',
              status: getGlucoseStatus(userData.glucoseLevel || 0)
            }
          };
          
          setHealthMetrics(fallbackHealthMetrics);
        }
        
        // Process appointment data
        if (appointmentsData && appointmentsData.length > 0) {
          const now = new Date();
          
          // Filter appointments based on time range
          const filteredAppointments = appointmentsData.filter(apt => {
            const aptDate = new Date(apt.date || apt.appointmentDate);
            if (timeRange === 'month') {
              return aptDate >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            } else if (timeRange === 'quarter') {
              return aptDate >= new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
            } else { // year
              return aptDate >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            }
          });
          
          // Count appointments by status
          const upcoming = filteredAppointments.filter(apt => 
            (apt.status === 'upcoming' || apt.status === 'scheduled') && 
            new Date(apt.date || apt.appointmentDate) > now
          ).length;

          const past = filteredAppointments.filter(apt => 
            (apt.status === 'completed' || new Date(apt.date || apt.appointmentDate) < now) && 
            apt.status !== 'cancelled'
          ).length;
          
          const cancelled = filteredAppointments.filter(apt => 
            apt.status === 'cancelled'
          ).length;
          
          // Count appointments by specialty
          const specialtyCounts = {};
          filteredAppointments.forEach(apt => {
            const specialty = apt.specialty || apt.doctorSpecialty || 'General';
            specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
          });
          
          const bySpecialty = Object.entries(specialtyCounts).map(([specialty, count]) => ({
            specialty,
            count
          })).sort((a, b) => b.count - a.count);
          
          // Count appointments by month
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthCounts = {};
          
          filteredAppointments.forEach(apt => {
            const aptDate = new Date(apt.date || apt.appointmentDate);
            const monthKey = months[aptDate.getMonth()];
            monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
          });
          
          const byMonth = months.map(month => ({
            month,
            count: monthCounts[month] || 0
          }));
          
          const processedAppointmentStats = {
            total: filteredAppointments.length,
            upcoming,
            past,
            cancelled,
            bySpecialty,
            byMonth
          };
          
          setAppointmentStats(processedAppointmentStats);
        } else {
          // Default empty appointment stats
          setAppointmentStats({
            total: 0,
            upcoming: 0,
            past: 0,
            cancelled: 0,
            bySpecialty: [],
            byMonth: []
          });
        }
        
        // Calculate medication adherence (simplified version)
        // In a real app, this would come from tracking actual medication intake
        setMedicationAdherence({
          overall: 90, // Default value
          byMedication: [],
          byMonth: []
        });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to fetch analytics data. Please try again later.');
      } finally {
      setLoading(false);
      }
    }
    
    if (user) {
      fetchUserData();
    }
  }, [user, timeRange]);
  
  // Helper functions for determining health status
  function getBPStatus(bp) {
    if (!bp) return 'normal';
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
          ) : error ? (
            <div className="p-8 text-center">
              <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Retry
              </button>
            </div>
          ) : healthMetrics ? (
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
                  {appointmentStats.total > 0 ? (
                    <>
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

                      {appointmentStats.bySpecialty.length > 0 && (
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
                      )}
                    </>
                  ) : (
                    <div className="bg-white border rounded-lg p-6 shadow-sm col-span-2 text-center">
                      <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-800">No Appointment Data Available</h3>
                      <p className="text-gray-500 mt-2">You don't have any appointments recorded for the selected time period.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Medication Adherence */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Medication Adherence</h2>
                <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
                  <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-800">Medication Tracking Coming Soon</h3>
                  <p className="text-gray-500 mt-2">We're working on a feature to help you track your medication adherence over time.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No health data available</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please update your health profile to see analytics and insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 