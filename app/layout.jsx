import { Inter } from 'next/font/google';
import ClientLayout from '../components/ClientLayout';
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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
} 