import { NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedPaths = [
  '/admin/review-projects',
  '/admin/view-project',
  '/dashboard',
  '/edit-project',
  '/projects',
  '/upload',
  '/watch'
];

// Public paths that should always be accessible
const publicPaths = [
  '/login',
  '/signUp',
  '/verify',
  '/',
  '/api',
  '/changePassword',
  '/test'
];

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Skip middleware for API routes and static assets
  if (path.startsWith('/api/') || path.includes('/_next/') || path.includes('/favicon.ico')) {
    return NextResponse.next();
  }
  
  // Check if it's a public path, if so, allow access
  if (publicPaths.some(prefix => path === prefix || path.startsWith(`${prefix}/`))) {
    return NextResponse.next();
  }
  
  // Check if the current path is in the protected routes
  const isProtectedPath = protectedPaths.some(prefix => 
    path === prefix || path.startsWith(`${prefix}/`)
  );
  
  if (isProtectedPath) {
    // Check authentication cookie
    const token = request.cookies.get('authToken')?.value;
    
    // If no token exists, redirect to login
    if (!token) {
      console.log('No auth token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Remove email parameter to prevent account switching via URL
    const url = new URL(request.url);
    if (url.searchParams.has('email')) {
      url.searchParams.delete('email');
      return NextResponse.redirect(url);
    }
  }
  
  // Allow access to non-protected routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}; 