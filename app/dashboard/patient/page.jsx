"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the patient dashboard
    router.replace('/dashboard');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Redirecting to Patient Dashboard...</p>
      </div>
    </div>
  );
} 