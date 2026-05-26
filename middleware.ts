import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                        response = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const {
            data: { user },
        } = await supabase.auth.getUser()

        const url = request.nextUrl.clone()

        // Protected routes: redirect to login if not logged in
        if (!user && url.pathname.startsWith('/dashboard')) {
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // Auth routes: redirect to dashboard if already logged in
        if (user && (url.pathname === '/login' || url.pathname === '/signup')) {
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        return response
    } catch (error) {
        // Log the error for debugging
        console.error('Middleware Supabase error:', error)

        // If Supabase is unreachable, allow the request to proceed
        // This prevents the entire app from breaking due to connection issues
        return response
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
