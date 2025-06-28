"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/authContext";
import LoginForm from "../components/LoginForm";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, authLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (email: string, password: string, rememberMe: boolean) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await login(email, password, rememberMe);

      if (result.success && result.redirectTo) {
        setSuccessMessage("Login successful! Redirecting...");
        console.log("Login successful, taking control of navigation");
        
        // Force navigation from the login page component
        try {
          // Store success info in localStorage
          localStorage.setItem('login_success', 'true');
          localStorage.setItem('redirect_to', result.redirectTo);
          console.log('🔵 Stored navigation data in localStorage');
          
          // Force navigation with multiple methods
          console.log('🔶 Direct navigation attempt from login page');
          
          // Method 1: Direct replacement (won't add to history)
          window.location.replace(result.redirectTo);
          
          // Method 2: Timeout as backup (will only run if Method 1 fails)
          setTimeout(() => {
            if (window.location.pathname.includes('/auth/login')) {
              console.log('⏱️ Fallback navigation from login page');
              window.location.replace(result.redirectTo);
            }
          }, 1000);
        } catch (e) {
          console.error('Navigation error:', e);
          // Last resort
          router.push(result.redirectTo);
        }
      } else if (result.requiresMFA) {
        setSuccessMessage("MFA verification required.");
        // Redirect to MFA page, passing email in query params
        router.push(`/mfa-verification?email=${encodeURIComponent(email)}`);
      } else if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        setError('An unknown error occurred during login');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setError("We're having trouble connecting to our servers. Please try again in a moment.");
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking authentication state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-indigo-900 via-indigo-800 to-indigo-700">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-indigo-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-indigo-200 text-lg font-medium">Checking authentication...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, show login form
  return (
    <LoginForm
      onSubmit={handleSubmit}
      error={error}
      successMessage={successMessage}
      isSubmitting={isSubmitting}
    />
  );
}