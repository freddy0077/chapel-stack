'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TestAuthPersistence() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Debug authentication state
    const checkAuthState = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      const cookieToken = document.cookie
        .split(';')
        .find(row => row.trim().startsWith('authToken='))
        ?.split('=')[1];

      setDebugInfo({
        localStorageToken: token ? `${token.slice(0, 20)}...` : 'None',
        localStorageUserData: userData ? JSON.parse(userData) : 'None',
        cookieToken: cookieToken ? `${cookieToken.slice(0, 20)}...` : 'None',
        contextUser: user,
        isAuthenticated,
        isLoading,
        timestamp: new Date().toISOString()
      });
    };

    checkAuthState();
    
    // Check every 2 seconds to see state changes
    const interval = setInterval(checkAuthState, 2000);
    
    return () => clearInterval(interval);
  }, [user, isAuthenticated, isLoading]);

  const handleHardRefresh = () => {
    window.location.reload();
  };

  const handleClearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.reload();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Persistence Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Current Auth State</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
            <div><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
            <div><strong>User ID:</strong> {user?.id || 'None'}</div>
            <div><strong>User Email:</strong> {user?.email || 'None'}</div>
            <div><strong>Primary Role:</strong> {user?.primaryRole || 'None'}</div>
            <div><strong>Organisation ID:</strong> {user?.organisationId || 'None'}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Storage Debug</h2>
          <div className="space-y-2 text-sm">
            <div><strong>LocalStorage Token:</strong> {debugInfo.localStorageToken}</div>
            <div><strong>Cookie Token:</strong> {debugInfo.cookieToken}</div>
            <div><strong>User Data Stored:</strong> {debugInfo.localStorageUserData ? 'Yes' : 'No'}</div>
            <div><strong>Last Check:</strong> {debugInfo.timestamp}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Stored User Data</h2>
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
          {JSON.stringify(debugInfo.localStorageUserData, null, 2)}
        </pre>
      </div>

      <div className="mt-6 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Context User Data</h2>
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
          {JSON.stringify(debugInfo.contextUser, null, 2)}
        </pre>
      </div>

      <div className="mt-6 space-x-4">
        <button
          onClick={handleHardRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Hard Refresh (Test Persistence)
        </button>
        <button
          onClick={handleClearAuth}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Clear Auth & Refresh
        </button>
      </div>

      <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Test Instructions:</h3>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. Login normally through /auth/login</li>
          <li>2. Navigate to this page (/test-auth-persistence)</li>
          <li>3. Check that all auth data is present</li>
          <li>4. Click "Hard Refresh" to test persistence</li>
          <li>5. Check if auth state is restored after refresh</li>
        </ol>
      </div>
    </div>
  );
}
