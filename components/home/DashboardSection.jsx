'use client';

import { motion } from 'framer-motion';

export default function DashboardSection() {
  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Dashboard</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Comprehensive Health Management
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
            Our intuitive dashboard brings all your health data together in one place
          </p>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="relative mx-auto max-w-5xl">
            {/* Dashboard mockup */}
            <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
              {/* Dashboard header */}
              <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <span className="ml-3 text-lg font-medium text-white">Patient Dashboard</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-6 rounded-full bg-white/20"></div>
                    <div className="h-6 w-6 rounded-full bg-white/20"></div>
                    <div className="h-6 w-6 rounded-full bg-white/20"></div>
                  </div>
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Appointments', value: '2', color: 'border-blue-500' },
                      { label: 'Medications', value: '4', color: 'border-teal-500' },
                      { label: 'Lab Tests', value: '3', color: 'border-indigo-500' },
                    ].map((item, index) => (
                      <div key={index} className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 ${item.color}`}>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart placeholder */}
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 h-64 flex items-center justify-center">
                    <div className="w-full h-40 flex items-end justify-around px-4">
                      {[35, 60, 40, 75, 50, 80, 65].map((height, index) => (
                        <div key={index} className="relative w-8">
                          <div 
                            className="bg-gradient-to-t from-blue-500 to-teal-400 rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Right column */}
                <div className="space-y-6">
                  {/* Upcoming appointments */}
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Upcoming Appointments</h3>
                    <div className="space-y-3">
                      {[
                        { doctor: 'Dr. Sarah Johnson', specialty: 'Cardiology', date: 'Jun 15, 10:00 AM' },
                        { doctor: 'Dr. Michael Lee', specialty: 'Dermatology', date: 'Jun 20, 2:30 PM' },
                      ].map((appt, index) => (
                        <div key={index} className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-700">
                          <div className="font-medium text-gray-900 dark:text-white">{appt.doctor}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{appt.specialty}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{appt.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Health metrics */}
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Health Metrics</h3>
                    <div className="space-y-3">
                      {[
                        { metric: 'Blood Pressure', value: '120/80 mmHg', status: 'normal' },
                        { metric: 'Heart Rate', value: '72 bpm', status: 'normal' },
                        { metric: 'Blood Sugar', value: '110 mg/dL', status: 'normal' },
                      ].map((metric, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{metric.metric}</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{metric.value}</span>
                            <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 