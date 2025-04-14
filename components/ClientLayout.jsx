"use client";

import { Toaster } from 'react-hot-toast';
import ClientAuthProvider from './ClientAuthProvider';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  return (
    <ClientAuthProvider>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
      <Footer />
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