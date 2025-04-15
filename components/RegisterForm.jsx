"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user', // Default to user
    agreeToTerms: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear errors when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the new API endpoint path
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Login the user with the returned data
      login({
        id: data.data.id,
        email: data.data.email,
        name: data.data.name,
        type: data.data.type,
        token: data.data.token
      });
    } catch (error) {
      setFormErrors({
        general: error.message || 'Registration failed. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    // Implement Google sign up functionality
    console.log('Google signup clicked');
    // This would typically redirect to Google OAuth endpoint
    alert('Google sign up functionality will be implemented with OAuth');
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {formErrors.general && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            {formErrors.general}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="firstName"
              id="firstName"
              autoComplete="given-name"
              className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ${
                formErrors.firstName ? 'ring-red-300' : 'ring-gray-300'
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
              value={formData.firstName}
              onChange={handleChange}
            />
            {formErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="lastName"
              id="lastName"
              autoComplete="family-name"
              className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ${
                formErrors.lastName ? 'ring-red-300' : 'ring-gray-300'
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
              value={formData.lastName}
              onChange={handleChange}
            />
            {formErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ${
              formErrors.email ? 'ring-red-300' : 'ring-gray-300'
            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ${
              formErrors.password ? 'ring-red-300' : 'ring-gray-300'
            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
            value={formData.password}
            onChange={handleChange}
          />
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ${
              formErrors.confirmPassword ? 'ring-red-300' : 'ring-gray-300'
            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {formErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 ${
            formErrors.agreeToTerms ? 'border-red-300' : 'border-gray-300'
          }`}
          checked={formData.agreeToTerms}
          onChange={handleChange}
        />
        <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
          I agree to the{' '}
          <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
            Privacy Policy
          </a>
        </label>
      </div>
      {formErrors.agreeToTerms && (
        <p className="mt-1 text-sm text-red-600">{formErrors.agreeToTerms}</p>
      )}

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or sign up with</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleSignup}
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
            <span className="text-sm font-medium">Sign up with Google</span>
          </button>
        </div>
      </div>
    </form>
  );
} 