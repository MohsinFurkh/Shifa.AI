import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureSection from '../components/FeatureSection';
import HeroSection from '../components/HeroSection';
import TestimonialsSection from '../components/TestimonialsSection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to Shifa.AI
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Your AI-powered healthcare platform for better health management.
          </p>
        </div>

        <div className="mt-10 flex justify-center space-x-4">
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
          >
            Register
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">For Patients</h3>
              <p className="mt-2 text-sm text-gray-500">
                Book appointments, track your health, and communicate with your doctors.
              </p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">For Doctors</h3>
              <p className="mt-2 text-sm text-gray-500">
                Manage appointments, access patient records, and provide better care.
              </p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">AI-Powered</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get intelligent insights and recommendations for better healthcare.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 