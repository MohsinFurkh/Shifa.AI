import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "ShifaAI - AI-Powered Healthcare Platform",
  description: "ShifaAI is an innovative AI-powered healthcare platform designed to revolutionize medical diagnostics, patient care, and healthcare management.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  );
} 