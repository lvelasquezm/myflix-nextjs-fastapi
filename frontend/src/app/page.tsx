'use client';

import { useEffect } from 'react';

import Hero from '@/components/home/Hero';
import Navbar from '@/components/home/Navbar/Navbar';
import ShowRow from '@/components/home/Shows/ShowRow';

import { useShowsStore } from '@/stores/showsStore';

export default function HomePage() {
  const { showRows, initMockData } = useShowsStore();

  useEffect(() => {
    // Initialize mock data when page mounts.
    if (showRows.length === 0) {
      initMockData();
    }
  }, [showRows.length, initMockData]);

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <Navbar onGenerateClick={() => {
        console.log('Generate clicked!');
      }} />

      {/* Hero */}
      <Hero />

      {/* Show Rows */}
      <div className="relative -mt-32">
        {showRows.map((row, i) => (
          <ShowRow key={row.id} showRow={row} index={i} />
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 md:px-12">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MyFlix. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Built with Next.js, Tailwind CSS, Shadcn/UI and Framer Motion.
          </p>
        </div>
      </footer>
    </div>
  );
}
