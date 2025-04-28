import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup']
// Define routes that require authentication
const authRoutes = ['/dashboard', '/profile', '/calendar', '/food-log']

export async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  const path = request.nextUrl.pathname

  // If user is authenticated and trying to access public routes (like homepage, login, signup)
  // redirect them to dashboard
  if (isAuthenticated && publicRoutes.some(route => path === route)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not authenticated and trying to access protected routes
  // redirect them to homepage
  if (!isAuthenticated && authRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to match specific paths
export const config = {
  matcher: [...publicRoutes, ...authRoutes]
}