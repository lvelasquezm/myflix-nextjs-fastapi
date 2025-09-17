import type { Metadata } from 'next';

import { geistSans, geistMono } from '@/lib/fonts';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'MyFlix - Your Own Streaming Experience',
  description: 'Experience the future of streaming with your own content!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
