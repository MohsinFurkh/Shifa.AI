'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-1/4 -left-24 w-80 h-80 bg-teal-100 dark:bg-teal-900/20 rounded-full opacity-50 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Revolutionizing Healthcare</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
                with AI-Powered Solutions
              </span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="mt-6 max-w-lg mx-auto text-lg text-gray-600 dark:text-gray-300 sm:max-w-3xl">
              ShifaAI combines cutting-edge artificial intelligence with medical expertise to deliver accurate diagnostics, 
              personalized treatment plans, and streamlined healthcare operations.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <Link
                  href="/register"
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                >
                  Get Started
                </Link>
                <Link
                  href="#features"
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 hover:bg-gray-50"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 