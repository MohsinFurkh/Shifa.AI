import './globals.css';

export const metadata = {
  title: 'Shifa.AI - AI-Powered Healthcare Platform',
  description: 'Connect with healthcare providers and manage your health journey',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 