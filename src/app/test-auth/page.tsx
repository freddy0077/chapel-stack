'use client';

import { useAuth } from '@/contexts/AuthContextEnhanced';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function TestAuthPage() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    primaryRole, 
    allowedDashboards, 
    defaultDashboard, 
    defaultRoute,
    logout,
    canAccessRoute,
    canAccessDashboard 
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-indigo-600 border-indigo-200 animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test Page</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">User Information</h2>
                <div className="space-y-2">
                  <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
                  <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
                  <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                  <p><strong>Primary Role:</strong> {primaryRole || 'N/A'}</p>
                  <p><strong>Branch:</strong> {user?.branch?.name || 'N/A'}</p>
                </div>
              </div>

              {/* Dashboard Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-green-900 mb-4">Dashboard Access</h2>
                <div className="space-y-2">
                  <p><strong>Default Dashboard:</strong> {defaultDashboard || 'N/A'}</p>
                  <p><strong>Default Route:</strong> {defaultRoute || 'N/A'}</p>
                  <p><strong>Allowed Dashboards:</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    {(allowedDashboards || []).map(dashboard => (
                      <li key={dashboard}>{dashboard}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Route Access Testing */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-yellow-900 mb-4">Route Access Test</h2>
                <div className="space-y-2">
                  <p><strong>/dashboard:</strong> {canAccessRoute('/dashboard') ? '✅ Allowed' : '❌ Denied'}</p>
                  <p><strong>/dashboard/super-admin:</strong> {canAccessRoute('/dashboard/super-admin') ? '✅ Allowed' : '❌ Denied'}</p>
                  <p><strong>/dashboard/branch:</strong> {canAccessRoute('/dashboard/branch') ? '✅ Allowed' : '❌ Denied'}</p>
                  <p><strong>/admin:</strong> {canAccessRoute('/admin') ? '✅ Allowed' : '❌ Denied'}</p>
                  <p><strong>/members:</strong> {canAccessRoute('/members') ? '✅ Allowed' : '❌ Denied'}</p>
                </div>
              </div>

              {/* Dashboard Access Testing */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-purple-900 mb-4">Dashboard Access Test</h2>
                <div className="space-y-2">
                  <p><strong>SUPER_ADMIN:</strong> {canAccessDashboard('SUPER_ADMIN') ? '✅ Allowed' : '❌ Denied'}</p>
                  <p><strong>ADMIN:</strong> {canAccessDashboard('ADMIN') ? '✅ Allowed' : '❌ Denied'}</p>
                  <p><strong>BRANCH_ADMIN:</strong> {canAccessDashboard('BRANCH_ADMIN') ? '✅ Allowed' : '❌ Denied'}</p>
                  <p><strong>FINANCE:</strong> {canAccessDashboard('FINANCE') ? '✅ Allowed' : '❌ Denied'}</p>
                  <p><strong>MEMBER:</strong> {canAccessDashboard('MEMBER') ? '✅ Allowed' : '❌ Denied'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
              <a
                href={defaultRoute}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
              >
                Go to Default Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
