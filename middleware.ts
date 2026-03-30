import { NextRequest, NextResponse } from 'next/server'

async function isValidSession(cookieValue: string, secret: string): Promise<boolean> {
  if (!secret || !cookieValue) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode('admin_session'))
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  // Constant-time compare
  if (cookieValue.length !== expected.length) return false
  let mismatch = 0
  for (let i = 0; i < cookieValue.length; i++) {
    mismatch |= cookieValue.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return mismatch === 0
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login/logout endpoints without auth
  if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    return NextResponse.next()
  }

  // Allow /admin/login page without auth
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // For /api/admin/* write routes, return 401 JSON instead of redirect
  const isApiRoute = pathname.startsWith('/api/admin/')
  if (isApiRoute && request.method === 'GET') {
    // GET requests to admin API still require auth but are checked by isAdmin() in handlers
    return NextResponse.next()
  }

  const session = request.cookies.get('admin_session')
  const secret = process.env.ADMIN_PASSWORD

  if (!session?.value || !secret) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const valid = await isValidSession(session.value, secret)
  if (!valid) {
    if (isApiRoute) {
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      response.cookies.delete('admin_session')
      return response
    }
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('admin_session')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
