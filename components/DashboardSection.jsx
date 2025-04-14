"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardSection() {
  const [imgError, setImgError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Only run client-side code after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <section className="py-16 bg-gray-50" id="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Patient Dashboard
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-500">
            Access your medical information, manage appointments, and communicate with healthcare providers, all in one place.
          </p>
        </div>
        
        <div className="relative">
          {/* Dashboard preview image */}
          <div className="rounded-lg shadow-xl overflow-hidden border border-gray-200">
            {isMounted ? (
              !imgError ? (
                <img 
                  src="/images/dashboard-preview.png" 
                  alt="ShifaAI Dashboard Preview" 
                  className="w-full"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div 
                  className="w-full h-[400px] flex items-center justify-center bg-gray-200 text-gray-500"
                  style={{ 
                    background: "#e2e8f0",
                    color: "#64748b", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    minHeight: "400px"
                  }}
                >
                  <span className="text-xl font-medium">Patient Dashboard Preview</span>
                </div>
              )
            ) : (
              <div 
                className="w-full h-[400px] flex items-center justify-center bg-gray-200 text-gray-500"
                style={{ 
                  background: "#e2e8f0",
                  color: "#64748b", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  minHeight: "400px"
                }}
              >
                <span className="text-xl font-medium">Patient Dashboard Preview</span>
              </div>
            )}
          </div>
          
          {/* Dashboard features */}
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment Management</h3>
              <p className="text-gray-500">Schedule, reschedule, or cancel appointments with ease. Receive reminders for upcoming visits.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Medical Records</h3>
              <p className="text-gray-500">Access your complete medical history, lab results, and doctor's notes in one secure location.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Secure Messaging</h3>
              <p className="text-gray-500">Communicate directly with your healthcare providers through our encrypted messaging system.</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 