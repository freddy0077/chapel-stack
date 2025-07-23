"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "../components/LoginForm";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (email: string, password: string, rememberMe: boolean) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await login(email, password);

      if (result.success) {
        setSuccessMessage("Login successful! Redirecting...");
        // The useAuth hook will handle the redirect automatically
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking authentication state
  if (isLoading) {
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