'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthInitialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';

  // Redirect logic based on auth status.
  useEffect(() => {
    // Don't redirect while still initializing.
    if (!isAuthInitialized) return;

    // Not authenticated and not on login page, redirect to login.
    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
      return;
    }

    // Authenticated and on login page, redirect to home.
    if (isAuthenticated && isLoginPage) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, isAuthInitialized, pathname, router, isLoginPage]);

  // Don't render anything while loading or during redirects.
  // AuthProvider handles the loading/initializing UI.
  if (!isAuthInitialized) {
    return null;
  }

  // Show login page if not authenticated and on login page.
  if (!isAuthenticated && isLoginPage) {
    return children;
  }

  // Show protected pages if authenticated and not on login page.
  if (isAuthenticated && !isLoginPage) {
    return children;
  }

  // Don't render anything during redirect.
  return null;
}
