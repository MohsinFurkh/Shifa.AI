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

export default function PatientAnalyticsPage() {
  const auth = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  
  // Health metrics state
  const [healthMetrics, setHealthMetrics] = useState({
    weight: { current: 75, previous: 76, unit: 'kg', trend: 'down' },
    bloodPressure: { current: '120/80', previous: '125/85', unit: 'mmHg', trend: 'down' },
    heartRate: { current: 72, previous: 75, unit: 'bpm', trend: 'down' },
    bloodSugar: { current: 95, previous: 100, unit: 'mg/dL', trend: 'down' }
  });
  
  // Appointment stats
  const [appointmentStats, setAppointmentStats] = useState({
    total: 12,
    upcoming: 3,
    past: 8,
    cancelled: 1,
    bySpecialty: [
      { name: 'Cardiology', count: 3, color: '#FF6384' },
      { name: 'Dermatology', count: 2, color: '#36A2EB' },
      { name: 'General Medicine', count: 4, color: '#FFCE56' },
      { name: 'Orthopedics', count: 2, color: '#4BC0C0' },
      { name: 'Neurology', count: 1, color: '#9966FF' }
    ],
    byMonth: [
      { month: 'Jan', count: 1 },
      { month: 'Feb', count: 2 },
      { month: 'Mar', count: 1 },
      { month: 'Apr', count: 3 },
      { month: 'May', count: 2 },
      { month: 'Jun', count: 1 },
      { month: 'Jul', count: 0 },
      { month: 'Aug', count: 0 },
      { month: 'Sep', count: 0 },
      { month: 'Oct', count: 0 },
      { month: 'Nov', count: 0 },
      { month: 'Dec', count: 2 }
    ]
  });
  
  // Medication adherence
  const [medicationAdherence, setMedicationAdherence] = useState({
    overall: 85,
    medications: [
      { name: 'Metformin', adherence: 90, dosage: '500mg', frequency: 'Twice daily' },
      { name: 'Lisinopril', adherence: 85, dosage: '10mg', frequency: 'Once daily' },
      { name: 'Atorvastatin', adherence: 80, dosage: '20mg', frequency: 'Once daily' }
    ],
    trend: [
      { week: 'Week 1', adherence: 75 },
      { week: 'Week 2', adherence: 80 },
      { week: 'Week 3', adherence: 90 },
      { week: 'Week 4', adherence: 85 }
    ]
  });
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setLoading(true);
    
    // Simulate loading data for different time ranges
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  
  if (!auth || !auth.user) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Health Analytics</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => handleTimeRangeChange('month')}
              className={`px-4 py-2 rounded-md ${
                timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleTimeRangeChange('quarter')}
              className={`px-4 py-2 rounded-md ${
                timeRange === 'quarter' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Quarter
            </button>
            <button
              onClick={() => handleTimeRangeChange('year')}
              className={`px-4 py-2 rounded-md ${
                timeRange === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Year
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Health Metrics Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Health Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Weight Card */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {healthMetrics.weight.current} {healthMetrics.weight.unit}
                      </p>
                    </div>
                    <div className={`flex items-center ${
                      healthMetrics.weight.trend === 'down' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {healthMetrics.weight.trend === 'down' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="ml-1 text-sm">
                        {Math.abs(healthMetrics.weight.current - healthMetrics.weight.previous)} {healthMetrics.weight.unit}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${
                      healthMetrics.weight.trend === 'down' ? 'bg-green-500' : 'bg-red-500'
                    }`} style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                {/* Blood Pressure Card */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Blood Pressure</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {healthMetrics.bloodPressure.current}
                      </p>
                    </div>
                    <div className={`flex items-center ${
                      healthMetrics.bloodPressure.trend === 'down' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {healthMetrics.bloodPressure.trend === 'down' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="ml-1 text-sm">Improved</span>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${
                      healthMetrics.bloodPressure.trend === 'down' ? 'bg-green-500' : 'bg-red-500'
                    }`} style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                {/* Heart Rate Card */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Heart Rate</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {healthMetrics.heartRate.current} {healthMetrics.heartRate.unit}
                      </p>
                    </div>
                    <div className={`flex items-center ${
                      healthMetrics.heartRate.trend === 'down' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {healthMetrics.heartRate.trend === 'down' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="ml-1 text-sm">
                        {Math.abs(healthMetrics.heartRate.current - healthMetrics.heartRate.previous)} {healthMetrics.heartRate.unit}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${
                      healthMetrics.heartRate.trend === 'down' ? 'bg-green-500' : 'bg-red-500'
                    }`} style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                {/* Blood Sugar Card */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Blood Sugar</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {healthMetrics.bloodSugar.current} {healthMetrics.bloodSugar.unit}
                      </p>
                    </div>
                    <div className={`flex items-center ${
                      healthMetrics.bloodSugar.trend === 'down' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {healthMetrics.bloodSugar.trend === 'down' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="ml-1 text-sm">
                        {Math.abs(healthMetrics.bloodSugar.current - healthMetrics.bloodSugar.previous)} {healthMetrics.bloodSugar.unit}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${
                      healthMetrics.bloodSugar.trend === 'down' ? 'bg-green-500' : 'bg-red-500'
                    }`} style={{ width: '55%' }}></div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Appointment Statistics Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Appointment Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Appointments */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <p className="text-sm text-gray-500">Total Appointments</p>
                  <p className="text-3xl font-bold text-gray-800">{appointmentStats.total}</p>
                  <div className="mt-4 h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                {/* Upcoming Appointments */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <p className="text-sm text-gray-500">Upcoming</p>
                  <p className="text-3xl font-bold text-green-600">{appointmentStats.upcoming}</p>
                  <div className="mt-4 h-1 bg-green-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600" style={{ width: `${(appointmentStats.upcoming / appointmentStats.total) * 100}%` }}></div>
                  </div>
                </div>
                
                {/* Past Appointments */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <p className="text-sm text-gray-500">Past</p>
                  <p className="text-3xl font-bold text-blue-600">{appointmentStats.past}</p>
                  <div className="mt-4 h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${(appointmentStats.past / appointmentStats.total) * 100}%` }}></div>
                  </div>
                </div>
                
                {/* Cancelled Appointments */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <p className="text-sm text-gray-500">Cancelled</p>
                  <p className="text-3xl font-bold text-red-600">{appointmentStats.cancelled}</p>
                  <div className="mt-4 h-1 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: `${(appointmentStats.cancelled / appointmentStats.total) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Appointments by Specialty */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">By Specialty</h3>
                  <div className="space-y-4">
                    {appointmentStats.bySpecialty.map((specialty, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">{specialty.name}</span>
                          <span className="text-sm font-medium text-gray-800">{specialty.count}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full"
                            style={{
                              width: `${(specialty.count / appointmentStats.total) * 100}%`,
                              backgroundColor: specialty.color
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Appointments by Month */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">By Month</h3>
                  <div className="h-60 flex items-end space-x-2">
                    {appointmentStats.byMonth.map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className="w-full bg-blue-500 rounded-t"
                          style={{
                            height: `${(item.count / Math.max(...appointmentStats.byMonth.map(m => m.count))) * 100}%`,
                            minHeight: item.count > 0 ? '10%' : '2%'
                          }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            
            {/* Medication Adherence Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Medication Adherence</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Overall Adherence */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Overall Adherence</h3>
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                          strokeDasharray="100, 100"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={medicationAdherence.overall >= 80 ? "#10B981" : 
                                 medicationAdherence.overall >= 60 ? "#FBBF24" : "#EF4444"}
                          strokeWidth="3"
                          strokeDasharray={`${medicationAdherence.overall}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{medicationAdherence.overall}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Medication-specific Adherence */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Medications</h3>
                  <div className="space-y-4">
                    {medicationAdherence.medications.map((medication, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <span className="text-sm font-medium text-gray-800">{medication.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {medication.dosage}, {medication.frequency}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{medication.adherence}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              medication.adherence >= 80 ? 'bg-green-500' :
                              medication.adherence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${medication.adherence}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Adherence Trend */}
                <div className="bg-white p-5 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Adherence Trend</h3>
                  <div className="h-48 flex items-end space-x-2">
                    {medicationAdherence.trend.map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-full rounded-t ${
                            item.adherence >= 80 ? 'bg-green-500' :
                            item.adherence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ height: `${item.adherence}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">{item.week}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 