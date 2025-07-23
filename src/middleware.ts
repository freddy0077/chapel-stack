import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simplified middleware for role-based authentication
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`🛡️ Middleware processing path: ${pathname}`);
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login', 
    '/auth/register', 
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/mfa-verification',
    '/test-auth-persistence' // Allow debug page
  ];
  
  if (publicRoutes.includes(pathname)) {
    console.log(`✅ Public route allowed: ${pathname}`);
    return NextResponse.next();
  }
  
  // Check for auth token in multiple places
  const cookieToken = request.cookies.get('authToken')?.value;
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const token = cookieToken || headerToken;
  
  if (!token) {
    console.log(`🔀 No token found, redirecting to login from: ${pathname}`);
    console.log(`🔍 Cookie token: ${cookieToken ? 'present' : 'missing'}`);
    console.log(`🔍 Header token: ${headerToken ? 'present' : 'missing'}`);
    
    // Add a small delay for client-side auth restoration on hard refresh
    if (request.headers.get('sec-fetch-mode') === 'navigate') {
      console.log('🔄 Navigation request detected, allowing brief auth restoration window');
      // For navigation requests (hard refresh), be more lenient
      // The client-side auth will handle the redirect if truly unauthenticated
    }
    
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // For now, let client-side handle role-based routing
  // Could add JWT verification here for additional security
  console.log(`✅ Token found, allowing access to: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/organizations/:path*',
    '/members/:path*',
    '/finances/:path*',
    '/attendance/:path*',
    '/pastoral-care/:path*',
    '/sacraments/:path*',
    '/groups/:path*',
    '/events/:path*',
    '/communication/:path*',
    '/reports/:path*'
  ]
};
