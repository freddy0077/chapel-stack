"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "../components/LoginForm";
import { useAuth } from "@/contexts/AuthContextEnhanced";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Pass credentials as an object as expected by the enhanced auth context
      const result = await login({
        email,
        password,
        rememberMe,
      });

      if (result.success) {
        setSuccessMessage("Login successful! Redirecting...");

        // Debug: Check what we got from login

        // Simple role-based redirect - no complex logic needed
        const userRole = result.user?.primaryRole || result.user?.roles?.[0];
        let redirectUrl = "/dashboard";

        // Map roles to their dashboard URLs
        switch (userRole) {
          case "SUBSCRIPTION_MANAGER":
            redirectUrl = "/dashboard/subscription-manager";
            break;
          case "ADMIN":
            redirectUrl = "/dashboard/admin";
            break;
          case "BRANCH_ADMIN":
            redirectUrl = "/dashboard/branch";
            break;
          case "FINANCE_MANAGER":
            redirectUrl = "/dashboard/finances";
            break;
          case "PASTORAL_STAFF":
            redirectUrl = "/dashboard/pastoral-care";
            break;
          default:
            redirectUrl = "/dashboard";
        }

        // Simple redirect using Next.js router
        setTimeout(() => {
          window.location.href = redirectUrl;
          // router.push(redirectUrl);
        }, 1000); // Small delay to show success message
      } else {
        // Extract error message from error object or use fallback
        const errorMessage =
          result.error?.message ||
          result.error ||
          "Login failed. Please try again.";
        setError(
          typeof errorMessage === "string"
            ? errorMessage
            : "Login failed. Please try again.",
        );
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
          <svg
            className="animate-spin h-10 w-10 text-indigo-300 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-indigo-200 text-lg font-medium">
            Checking authentication...
          </span>
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
