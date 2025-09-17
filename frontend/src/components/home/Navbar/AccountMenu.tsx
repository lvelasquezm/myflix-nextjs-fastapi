import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User as UserIcon, LogOut as LogOutIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

export default function AccountMenu() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  // Close the menu when pressing the escape key or clicking outside.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const handleLogout = () => {
    logout();
    setIsVisible(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <Button
        variant="default"
        className="rounded-full w-10 h-10 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        onClick={() => setIsVisible((prev) => !prev)}
      >
        <UserIcon className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isVisible && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-gray-800 rounded-lg shadow-lg py-2"
          >
            <li className="px-4 py-2 border-b border-gray-800">
              <p className="text-sm text-white font-medium">{user?.email}</p>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start text-gray-300 rounded-none">
                Account
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start text-gray-300 rounded-none">
                Settings
              </Button>
            </li>
            <li className="border-t border-gray-800">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 rounded-none"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}