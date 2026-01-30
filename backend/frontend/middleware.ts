import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip locale handling for API routes, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }
  
  // Protected routes that require authentication
  const protectedRoutes = ['/portal', '/bookings'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // For protected routes, we let the client-side handle authentication
  const response = NextResponse.next();
  
  // Set default locale cookie if not set (Arabic)
  if (!request.cookies.get('locale')) {
    response.cookies.set('locale', 'ar', { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }
  
  return response;
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
