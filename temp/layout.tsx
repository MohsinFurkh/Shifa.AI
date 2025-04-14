import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import our layout components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { PatientProvider } from '@/contexts/PatientContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "ShifaAI - AI-Powered Healthcare Platform",
  description: "ShifaAI is an innovative AI-powered healthcare platform designed to revolutionize medical diagnostics, patient care, and healthcare management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PatientProvider>
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
        </PatientProvider>
      </body>
    </html>
  );
}
