import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simplified middleware for role-based authentication
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login', 
    '/auth/register', 
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/mfa-verification',
    '/test-auth-persistence', // Allow debug page
    '/test-auth', // Allow test auth page
    '/test-login' // Allow test login page
  ];
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Check for auth token in multiple places
  const cookieToken = request.cookies.get('authToken')?.value;
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const accessToken = request.cookies.get('chapel_auth_token')?.value;
  const token = cookieToken || headerToken || accessToken;
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Token found, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/organizations/:path*',
    '/members/:path*',
    '/finances/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/subscriptions/:path*'
  ],
};
