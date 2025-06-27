import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  console.log(`🛡️ Middleware processing path: ${path}`);
  
  // Define public paths that don't require authentication
  const publicPaths = [
    '/auth/login',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/mfa-verification'
  ];
  
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  );
  
  // Check if user is authenticated by looking for the REFRESH token cookie
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isAuthenticated = !!refreshToken;
  
  console.log(`🔐 Auth check for ${path} - isPublic: ${isPublicPath}, isAuthenticated: ${isAuthenticated} (based on refreshToken)`);
  
  // Log cookie information for debugging
  console.log(`🍪 Cookies in request:`, 
    Object.fromEntries(
      Array.from(request.cookies.getAll()).map(cookie => [cookie.name, cookie.value ? 'Present' : 'Empty'])
    )
  );
  
  // Get user data to check role-based access (if available)
  const userJson = request.cookies.get('user')?.value;
  let user = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
      console.log(`👤 User data found: ${user?.id}, has redirectPath: ${!!user?.redirectPath}`);
    } catch (e) {
      console.error('❌ Error parsing user JSON in middleware:', e);
    }
  }
  
  // Onboarding enforcement for SUPER_ADMIN
  const onboardingDeferred = request.cookies.get('onboardingDeferred')?.value === 'true';
  console.log(`[Middleware] Onboarding deferred cookie value: ${request.cookies.get('onboardingDeferred')?.value}, Parsed as: ${onboardingDeferred}`);

  const isSuperAdmin = user?.roles?.some((role: unknown) => {
    if (typeof role === 'string') return role.toLowerCase() === 'super_admin' || role.toLowerCase() === 'superadmin';
    if (role && typeof role === 'object' && 'name' in role && typeof role.name === 'string') return role.name.toLowerCase() === 'super_admin' || role.name.toLowerCase() === 'superadmin';
    return false;
  });
  // Only enforce onboarding on dashboard/admin paths, not onboarding itself or public paths
  const isOnboardingPath = path.startsWith('/onboarding');
  if (isSuperAdmin && !onboardingDeferred && !isOnboardingPath && (path.startsWith('/dashboard') || path.startsWith('/admin'))) {
    console.log(`[Middleware] Decision: Redirecting SUPER_ADMIN to /onboarding.`);
    // Here you can check if onboarding is actually needed (add your own logic if needed)
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }
  
  // Redirect logic now re-enabled
  if (isPublicPath && isAuthenticated && publicPaths.includes(path)) {
    // Only redirect if the path is an exact known public path (not for all unmatched routes)
    const redirectPath = user?.redirectPath || '/dashboard';
    console.log(`🔀 Redirecting authenticated user from public path to: ${redirectPath}`);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }
  
  // Only redirect to login for main dashboard and protected paths
  const isProtectedPath = path.startsWith('/dashboard') || path.startsWith('/admin');
  
  if (isProtectedPath && !isAuthenticated) {
    console.log(`🔀 Redirecting unauthenticated user from protected path to login`);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  console.log(`[Middleware] Decision: Allowing access to ${path}`);
  console.log(`✅ Middleware allowing access to: ${path}`);
  return NextResponse.next();
}

// Configure middleware to run only on the specified paths
export const config = {
  matcher: [
    // Only run middleware on these specific paths
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/auth/login',
    '/logout',
    '/' // Homepage
  ]
};
