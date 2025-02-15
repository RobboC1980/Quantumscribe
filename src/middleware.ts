import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Authentication check
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    // Redirect unauthenticated users to login page except for public routes
    if (
      !req.nextUrl.pathname.startsWith('/api') && // Allow API routes
      !req.nextUrl.pathname.startsWith('/_next') && // Allow Next.js internals
      !req.nextUrl.pathname.startsWith('/static') && // Allow static files
      req.nextUrl.pathname !== '/' && // Allow home page
      req.nextUrl.pathname !== '/login' &&
      req.nextUrl.pathname !== '/signup' &&
      req.nextUrl.pathname !== '/reset-password' &&
      req.nextUrl.pathname !== '/pricing'
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (session && (
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/signup') ||
    req.nextUrl.pathname.startsWith('/reset-password')
  )) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 