'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell as BellIcon, Sparkles as SparklesIcon } from 'lucide-react';
import Link from 'next/link';

import AccountMenu from '@/components/home/Navbar/AccountMenu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onGenerateClick: () => void;
}

// Threshold (in px) for the page to be considered scrolled.
const SCROLL_THRESHOLD = 50;

export default function Navbar({ onGenerateClick }: NavbarProps) {
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  // Handle scroll effect.
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-30 transition-all duration-500',
        hasScrolled ? 'bg-black backdrop-blur-sm' : 'bg-transparent navbar-gradient'
      )}
    >
      <div className="mx-auto px-4 md:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
        >
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary">MyFlix</h1>
          </Link>
        </motion.div>

        {/* Nav links */}
        <div className="hidden sm:flex items-center space-x-8">
          <Link href="/" className="text-gray-300 font-medium hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/" className="text-gray-300 font-medium hover:text-white transition-colors">
            Series
          </Link>
          <Link href="/" className="text-gray-300 font-medium hover:text-white transition-colors">
            Movies
          </Link>
          <Link href="/" className="text-gray-300 font-medium hover:text-white transition-colors">
            My List
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Console button */}
          <Button
            size="sm"
            onClick={onGenerateClick}
          >
            <SparklesIcon className="mr-2 h-4 w-4" />
            Generate
          </Button>

          {/* Notifications (it doesn't do anything for now). */}
          <Button variant="link" className="text-white p-0">
            <BellIcon className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <AccountMenu />
        </div>
      </div>
    </motion.nav>
  );
}
