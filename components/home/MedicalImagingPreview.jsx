'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MedicalImagingPreview() {
  return (
    <div className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
          {/* Content */}
          <motion.div 
            className="relative z-10 lg:py-16"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="max-w-md mx-auto lg:max-w-none">
              <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Medical Imaging
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                Advanced AI Medical Image Analysis
              </p>
              <p className="mt-5 text-lg text-gray-600 dark:text-gray-300">
                Our AI algorithms can analyze medical images including X-rays, MRIs, and CT scans to 
                detect abnormalities with high accuracy, providing faster and more reliable diagnostics.
              </p>
              
              <div className="mt-8 space-y-6">
                {[
                  'AI-powered abnormality detection',
                  'Instant analysis and results',
                  'High accuracy and reliability',
                  'Support for multiple imaging types',
                ].map((feature, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-600 dark:text-gray-300">{feature}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link
                  href="/features/medical-imaging"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium"
                >
                  Learn more about our medical imaging
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Image */}
          <motion.div 
            className="mt-12 lg:mt-0 lg:relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              {/* Background pattern */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20" />
              
              {/* Sample medical images grid */}
              <div className="relative rounded-2xl overflow-hidden p-6 grid grid-cols-2 gap-4">
                {[
                  'bg-gray-800 dark:bg-blue-900',
                  'bg-gray-700 dark:bg-blue-800',
                  'bg-gray-700 dark:bg-blue-800',
                  'bg-gray-800 dark:bg-blue-900',
                ].map((bgColor, index) => (
                  <div key={index} className={`rounded-lg ${bgColor} aspect-square`}>
                    <div className="h-full w-full flex items-center justify-center text-blue-200">
                      {/* Placeholder for medical image */}
                      <svg className="w-12 h-12 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                ))}
                
                {/* AI detection overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-green-500 dark:border-green-400 animate-pulse opacity-70"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 