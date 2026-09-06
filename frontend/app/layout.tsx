import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Business Foresight — AI Early-Warning & Decision Support',
  description: 'Personalized AI early-warning system and business advisor grounded in historical scenario intelligence and internal business metrics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        {children}
      </body>
    </html>
  );
}
