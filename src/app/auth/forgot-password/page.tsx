"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import AuthCard from "../components/AuthCard";
import FormInput from "../components/FormInput";
import AuthButton from "../components/AuthButton";
import "../components/AuthStyles.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, error, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Password reset error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <AuthCard
        title="Reset your password"
        subtitle="Enter your email address and we'll send you a link to reset your password"
      >
        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-400 to-green-500 mb-6 shadow-md">
              <CheckCircleIcon
                className="h-12 w-12 text-white"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Check your email
            </h3>
            <div className="max-w-md mx-auto">
              <p className="text-gray-600 mb-8">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-medium text-indigo-600">{email}</span>. If
                you don&apos;t see it within a few minutes, please check your
                spam folder.
              </p>
              <div className="mb-6">
                <AuthButton
                  onClick={() => (window.location.href = "/auth/login")}
                  leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
                >
                  Return to login
                </AuthButton>
              </div>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-4">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                <span>{error}</span>
              </div>
            )}

            {/* Email field with icon */}
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              required
            />

            {/* Submit button */}
            <div className="mt-2">
              <AuthButton type="submit" isLoading={isLoading || isSubmitting}>
                Send Reset Link
              </AuthButton>
            </div>

            {/* Back to login */}
            <div className="auth-footer">
              <Link
                href="/auth/login"
                className="auth-link inline-flex items-center"
              >
                <ArrowLeftIcon className="h-3 w-3 mr-1" />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </AuthCard>
    </div>
  );
}
