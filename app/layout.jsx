import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'ShifaAI - AI-Powered Healthcare Platform',
  description: 'Your personal AI healthcare assistant for better health management and medical consultations.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
} 