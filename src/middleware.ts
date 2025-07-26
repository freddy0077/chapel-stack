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
    '/test-auth-persistence', // Allow debug page
    '/test-auth', // Allow test auth page
    '/test-login' // Allow test login page
  ];
  
  if (publicRoutes.includes(pathname)) {
    console.log(`✅ Public route allowed: ${pathname}`);
    return NextResponse.next();
  }
  
  // Check for auth token in multiple places
  const cookieToken = request.cookies.get('authToken')?.value;
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const accessToken = request.cookies.get('chapel_auth_token')?.value;
  const token = cookieToken || headerToken || accessToken;
  
  console.log('🔍 Middleware token check:', {
    cookieToken: cookieToken ? 'present' : 'missing',
    headerToken: headerToken ? 'present' : 'missing', 
    accessToken: accessToken ? 'present' : 'missing',
    finalToken: token ? 'found' : 'not found',
    pathname: pathname
  });
  
  if (!token) {
    console.log(`🔀 No token found, redirecting to login from: ${pathname}`);
    console.log(`🔍 Cookie token: ${cookieToken ? 'present' : 'missing'}`);
    console.log(`🔍 Header token: ${headerToken ? 'present' : 'missing'}`);
    console.log(`🔍 Access token: ${accessToken ? 'present' : 'missing'}`);
    console.log(`🔀 Redirecting to login page with URL: ${new URL('/auth/login', request.url)}`);
    console.log(`🔀 Request URL: ${request.url}`);
    console.log(`🔀 Request headers: ${JSON.stringify(request.headers)}`);
    console.log(`🔀 Request cookies: ${JSON.stringify(request.cookies)}`);
    
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Token found, allow access
  console.log(`✅ Token found, allowing access to: ${pathname}`);
  console.log(`✅ Request URL: ${request.url}`);
  console.log(`✅ Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`✅ Request cookies: ${JSON.stringify(request.cookies)}`);
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
