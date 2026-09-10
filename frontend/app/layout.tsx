import './globals.css';
import React from 'react';

export const metadata = {
  title: 'ForesightAI — Enterprise AI Business Early-Warning & Decision Support',
  description: 'Personalized AI early-warning system and business advisor grounded in historical scenario intelligence and internal business metrics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo-icon.png" type="image/png" />
        <link rel="shortcut icon" href="/logo-icon.png" type="image/png" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
