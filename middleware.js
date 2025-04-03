import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/debug'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the requested path is a public route
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/api/') || pathname.startsWith('/_next/'))) {
    return NextResponse.next();
  }
  
  // Check for token in cookies
  const token = request.cookies.get('token')?.value;
  
  // If no token and trying to access protected route, redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  try {
    // Verify token (optional, for additional security)
    await verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
}

async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export const config = {
  matcher: [
    // Match all paths except for public assets, api routes, and Next.js internal routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}; 