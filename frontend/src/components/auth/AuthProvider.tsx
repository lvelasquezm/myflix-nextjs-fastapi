'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/stores/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isLoading } = useAuthStore();

  // Initialize auth state on app load
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading spinner while determining auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}
