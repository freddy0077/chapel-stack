"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SpotifyCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Parse the URL params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMessage(error);
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMessage('No authorization code provided');
      return;
    }

    // Exchange code for access token using our secure API route
    const handleAuth = async () => {
      try {
        // Call our server API route instead of directly calling Spotify
        const response = await fetch('/api/spotify/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        });
        
        if (!response.ok) {
          throw new Error('Failed to exchange token');
        }
        
        const tokenData = await response.json();
        
        // Store tokens in localStorage
        localStorage.setItem('spotify_access_token', tokenData.access_token);
        localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
        localStorage.setItem('spotify_expires_at', (Date.now() + tokenData.expires_in * 1000).toString());
        
        // Set success state
        setStatus('success');
        
        // Redirect back to worship page after a short delay
        setTimeout(() => {
          router.push('/dashboard/worship');
        }, 1500);
      } catch (error) {
        console.error('Error during token exchange:', error);
        setStatus('error');
        setErrorMessage('Failed to authenticate with Spotify');
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Authenticating with Spotify...</h2>
            <p className="mt-2 text-gray-600">Please wait while we complete the authentication process.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Successfully Connected to Spotify!</h2>
            <p className="mt-2 text-gray-600">Redirecting you back to the worship page...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Authentication Failed</h2>
            <p className="mt-2 text-gray-600">{errorMessage || 'An unknown error occurred'}</p>
            <button
              onClick={() => router.push('/dashboard/worship')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Worship Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
