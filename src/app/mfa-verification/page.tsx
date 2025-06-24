"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/graphql/hooks/useAuth';

export default function MFAVerificationPage() {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const router = useRouter();
  const { verifyMFA } = useAuth();

  // Countdown timer for code expiration
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Check if MFA session exists
  useEffect(() => {
    const mfaSessionId = sessionStorage.getItem('mfaSessionId');
    if (!mfaSessionId) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!code || code.length < 6) {
      setErrorMessage('Please enter a valid verification code');
      setIsLoading(false);
      return;
    }

    try {
      const result = await verifyMFA(code);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(result.error || 'Invalid verification code');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during verification';
      setErrorMessage(errorMessage);
      console.error('MFA verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    // Here you would implement the logic to request a new code
    // For now, we'll just reset the countdown
    setCountdown(30);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the verification code from your authenticator app
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="sr-only">
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="6-digit verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Code expires in <span className="font-medium">{countdown}</span> seconds
          </p>
          <button
            onClick={handleResendCode}
            disabled={countdown > 0}
            className="mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium disabled:text-gray-400"
          >
            {countdown > 0 ? `Resend code (${countdown}s)` : 'Resend code'}
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => router.push('/auth/login')}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
