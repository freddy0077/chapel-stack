'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import OnboardingFlow from './OnboardingFlow';

interface OnboardingControllerProps {
  children: React.ReactNode;
}

export default function OnboardingController({ children }: OnboardingControllerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Only check onboarding status after mounting (client-side)
    if (typeof window !== 'undefined') {
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      const isOnboardingPage = pathname === '/onboarding';
      
      // Don't show onboarding if:
      // 1. User is already on the onboarding page
      // 2. Onboarding has been completed
      // 3. User is on a login/auth page
      const skipOnboarding = 
        isOnboardingPage || 
        onboardingCompleted === 'true' || 
        pathname.includes('/auth') ||
        pathname === '/';
      
      setShowOnboarding(!skipOnboarding);
      setIsLoading(false);
    }
  }, [pathname]);
  
  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
    
    // If user was explicitly on the onboarding page, redirect to dashboard
    if (pathname === '/onboarding') {
      router.push('/dashboard');
    }
  };
  
  // Still loading - don't render anything yet to avoid flashes
  if (isLoading) {
    return null;
  }
  
  // If we should show onboarding, render the onboarding flow
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }
  
  // Otherwise, render the children (normal app content)
  return <>{children}</>;
}
