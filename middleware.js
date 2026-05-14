import { NextResponse } from 'next/server';

/**
 * Stare linki w mailach wskazują na /api/auth/verify-email — pełne wejście w ten URL
 * powodowało ładowanie SPA / błąd „hard navigate to the same URL”.
 * Przekierowanie na stronę SSR z getServerSideProps naprawia flow.
 */
export function middleware(request) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token || !String(token).trim()) {
    const url = new URL('/panel/freelancer/login', request.url);
    url.searchParams.set('verify', 'missing');
    return NextResponse.redirect(url);
  }

  const url = new URL('/panel/freelancer/activate', request.url);
  url.searchParams.set('token', String(token).trim());
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/api/auth/verify-email',
};
