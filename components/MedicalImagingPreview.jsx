"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export default function MedicalImagingPreview() {
  const [imgError, setImgError] = useState(false);
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Advanced AI Medical Imaging Analysis
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our cutting-edge AI technology helps healthcare providers analyze medical imaging with unprecedented accuracy and speed.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Faster Diagnosis</h3>
                  <p className="mt-2 text-base text-gray-500">
                    AI-powered analysis can help detect abnormalities faster, reducing wait times for critical diagnoses.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Enhanced Accuracy</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our AI models have been trained on millions of images to achieve exceptional diagnostic accuracy.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Real-time Analysis</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get immediate insights from medical scans including X-rays, MRIs, and CT scans.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 lg:mt-0">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="relative w-full" style={{ minHeight: "300px" }}>
                {!imgError ? (
                  <img 
                    src="/images/Fig-1.jpg" 
                    alt="AI Medical Imaging Analysis" 
                    className="w-full"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div 
                    className="w-full h-[300px] flex items-center justify-center bg-gray-200 text-gray-500"
                  >
                    <span className="text-xl font-medium">AI Medical Imaging</span>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-4">
                <div className="text-sm font-medium text-gray-500">
                  AI-powered analysis highlighting potential areas of concern
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 