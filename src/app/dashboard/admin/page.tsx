"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon, ShieldCheckIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Protect this route - requires ADMIN role
  useProtectedRoute({ requiredRole: 'SUPER_ADMIN' });
  
  // Set loading to false after initial render
  useEffect(() => {
    // Short timeout to ensure the route protection has a chance to redirect if needed
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
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
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Manage your church organization</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage user accounts and permissions</p>
            <button 
              onClick={() => router.push('/dashboard/admin/users')} 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Manage Users
            </button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configure role-based permissions</p>
            <button 
              onClick={() => router.push('/dashboard/admin/roles')} 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Manage Roles
            </button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configure system settings</p>
            <button 
              onClick={() => router.push('/dashboard/admin/settings')} 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              System Settings
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}