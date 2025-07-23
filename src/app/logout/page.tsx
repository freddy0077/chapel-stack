"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [logoutAttempted, setLogoutAttempted] = useState(false);

  useEffect(() => {
    // Only attempt logout once to prevent loops
    if (!logoutAttempted) {
      const performLogout = async () => {
        setLogoutAttempted(true);
        try {
          await logout();
          // Redirect to login page after logout
          router.push('/auth/login');
        } catch (error) {
          console.error('Logout failed:', error);
          // Still redirect to login page even if logout fails
          router.push('/auth/login');
        }
      };

      performLogout();
    }
  }, [logout, router, logoutAttempted]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Signing out...</h1>
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}
