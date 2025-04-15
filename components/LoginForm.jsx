"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Use the new API endpoint path
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userType: 'user', // Default all logins to 'user' type
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check if user data already exists in localStorage to preserve profile data
      const existingUserData = localStorage.getItem('shifaai_user');
      let savedUserData = null;
      
      if (existingUserData) {
        try {
          const parsedData = JSON.parse(existingUserData);
          // If this is the same user (by email and type), preserve their data
          if (parsedData.email === data.data.email && parsedData.type === data.data.type) {
            savedUserData = parsedData;
          }
        } catch (e) {
          console.error("Error parsing existing user data", e);
        }
      }
      
      // Create user data object, preserving existing data if available
      const userData = {
        id: data.data.id,
        email: data.data.email,
        name: data.data.name || (savedUserData?.name || ''),
        type: data.data.type,
        token: data.data.token,
        // Preserve health metrics and profile data
        bloodPressure: savedUserData?.bloodPressure || '',
        heartRate: savedUserData?.heartRate || '',
        glucoseLevel: savedUserData?.glucoseLevel || '',
        height: savedUserData?.height || '',
        weight: savedUserData?.weight || '',
        lastMetricsUpdate: savedUserData?.lastMetricsUpdate || '',
        dateOfBirth: savedUserData?.dateOfBirth || '',
        gender: savedUserData?.gender || '',
        bloodType: savedUserData?.bloodType || '',
        allergies: savedUserData?.allergies || '',
        medicalConditions: savedUserData?.medicalConditions || '',
        medications: savedUserData?.medications || '',
        phone: savedUserData?.phone || '',
        // Preserve appointments if they exist
        appointments: savedUserData?.appointments || [],
        // Preserve reports if they exist
        reports: savedUserData?.reports || []
      };
      
      // Login the user with the combined data
      login(userData);
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login functionality
    console.log('Google login clicked');
    // This would typically redirect to Google OAuth endpoint
    alert('Google login functionality will be implemented with OAuth');
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-12">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 px-2"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 px-2"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm leading-6">
                <Link href="/forgot-password" className="font-semibold text-primary-600 hover:text-primary-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-75"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0353 3.12C17.9503 1.89 15.2353 1 12.0003 1C7.31028 1 3.25527 3.84 1.28027 7.65L5.27028 10.71C6.29028 7.28 8.91528 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.27C23.49 11.48 23.42 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.95 21.1C22.18 19.01 23.49 15.92 23.49 12.27Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26998 14.29C5.02998 13.57 4.89999 12.8 4.89999 12C4.89999 11.2 5.02998 10.43 5.26998 9.71001L1.28 6.65C0.47 8.3 0 10.1 0 12C0 13.9 0.47 15.7 1.28 17.35L5.26998 14.29Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 23C15.2404 23 17.9604 22.01 19.9504 20.11L16.0804 17.1C15.0054 17.9 13.6204 18.42 12.0004 18.42C8.91544 18.42 6.29044 15.89 5.27044 12.46L1.27045 15.56C3.25045 19.38 7.31044 23 12.0004 23Z"
                    fill="#34A853"
                  />
                </svg>
                <span className="text-sm font-medium">Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <Link href="/register" className="font-semibold leading-6 text-primary-600 hover:text-primary-500">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}