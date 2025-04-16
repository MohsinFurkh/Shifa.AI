"use client";

import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import ClientAuthProvider from './ClientAuthProvider';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  // Determine if it's a protected route
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  
  return (
    <ClientAuthProvider>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
      <Footer isDashboardRoute={isDashboardRoute} />
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: '#333',
          },
        }}
      />
    </ClientAuthProvider>
  );
} 