'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginSuccessPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Redirecting to your dashboard...');
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [targetUrl, setTargetUrl] = useState('');

  useEffect(() => {
    // Get the highest role from localStorage if available
    const determineTargetDashboard = () => {
      try {
        // First try to get auth token - if no token, redirect to login
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('❌ No auth token found, redirecting to login');
          return '/auth/login';
        }
        
        // Check for a pre-stored redirect path (set by useAuth and authContext)
        const redirectPath = localStorage.getItem('redirectPath');
        if (redirectPath) {
          console.log('🔄 Using pre-stored redirect path:', redirectPath);
          return redirectPath;
        }
        
        // Check for a primary role in localStorage (set by authContext)
        const primaryRole = localStorage.getItem('primaryRole');
        if (primaryRole) {
          console.log('🏅 Using stored primary role:', primaryRole);
          return getDashboardRouteForRole(primaryRole);
        }
        
        // Try to parse user data from localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
          console.error('❌ No user data found, redirecting to login');
          return '/auth/login';
        }
        
        const user = JSON.parse(userData);
        console.log('👤 User data found:', user);
        
        // First check if there's a redirectPath already determined during login
        if (user.redirectPath) {
          console.log('🔄 Using pre-determined redirect path from user object:', user.redirectPath);
          return user.redirectPath;
        }
        
        // Get primary role if available in user object
        if (user.primaryRole) {
          console.log('🏅 Primary role found in user object:', user.primaryRole);
          return getDashboardRouteForRole(user.primaryRole);
        }
        
        // If no primaryRole in user object, try to determine it from roles array
        if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
          console.log('🔍 Determining role from roles array:', user.roles);
          
          // Define role priority (higher index = higher priority)
          const rolePriority = ['member', 'volunteer', 'content_manager', 'finance_manager', 'ministry_leader', 'pastor', 'branch_admin', 'super_admin'];
          
          let highestRoleIndex = -1;
          let highestRole = 'member';
          
          // Get the highest priority role
          user.roles.forEach((role: string | { name?: string; role?: string; title?: string; type?: string; id?: string }) => {
            let roleName;
            
            // Handle role being a string or an object
            if (typeof role === 'string') {
              roleName = role.toLowerCase().replace(/\s+/g, '_');
            } else if (role && typeof role === 'object' && role.name) {
              roleName = role.name.toLowerCase().replace(/\s+/g, '_');
            } else if (role && typeof role === 'object') {
              // Try to extract role from alternative properties
              const potentialProps = ['role', 'title', 'type', 'id'] as const;
              for (const prop of potentialProps) {
                if (prop in role) {
                  const value = role[prop];
                  if (typeof value === 'string') {
                    roleName = value.toLowerCase().replace(/\s+/g, '_');
                    break;
                  }
                }
              }
              
              if (!roleName) return; // Skip this role if we couldn't extract a name
            } else {
              return; // Skip this role if it's not in a recognizable format
            }
            
            const roleIndex = rolePriority.indexOf(roleName);
            if (roleIndex > highestRoleIndex) {
              highestRoleIndex = roleIndex;
              highestRole = roleName;
            }
          });
          
          console.log('🎯 Determined highest role:', highestRole);
          
          // Save the determined role for future use
          localStorage.setItem('primaryRole', highestRole);
          const dashboardUrl = getDashboardRouteForRole(highestRole);
          localStorage.setItem('redirectPath', dashboardUrl);
          
          return dashboardUrl;
        }
        
        console.log('⚠️ No role information found, defaulting to member dashboard');
        return '/dashboard';
      } catch (error) {
        console.error('❌ Error determining dashboard:', error);
        return '/auth/login';
      }
    };
    
    // Helper function to get dashboard route based on role
    const getDashboardRouteForRole = (role: string): string => {
      switch(role) {
        case 'super_admin':
          return '/dashboard';
        case 'branch_admin':
          return '/dashboard/branch';
        case 'pastor':
          return '/dashboard/pastor';
        case 'ministry_leader':
          return '/dashboard/ministries';
        case 'finance_manager':
          return '/dashboard/finances';
        case 'content_manager':
          return '/dashboard/content';
        case 'volunteer':
          return '/dashboard/volunteer';
        default:
          return '/dashboard';
      }
    };
    
    // Determine target URL
    const targetDashboard = determineTargetDashboard();
    setTargetUrl(targetDashboard);
    
    // Update message based on the target dashboard
    setMessage(`Redirecting to ${targetDashboard.split('/').pop() || 'main'} dashboard...`);
    
    // Redirect after countdown
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          console.log('🚀 Redirecting to:', targetDashboard);
          router.push(targetDashboard);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Login Successful!</h1>
          <p className="mt-2 text-gray-600">{message}</p>
          <p className="mt-4 text-sm text-gray-500">
            Redirecting in {secondsLeft} seconds...
          </p>
          <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(3 - secondsLeft) / 3 * 100}%` }}
            ></div>
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-gray-600">Target dashboard: {targetUrl}</p>
            <button
              onClick={() => window.location.href = targetUrl}
              className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
