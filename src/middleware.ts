import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Create a supabase client for middleware
    // We need to pass the cookies to supabase so it can authenticate the user
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
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

    if (user) {
        console.log("Middleware User Debug:", {
            id: user.id,
            email: user.email,
            confirmed_at: user.email_confirmed_at,
            app_metadata: user.app_metadata,
            user_metadata: user.user_metadata
        })
    }

    const path = request.nextUrl.pathname

    // Protect inventory routes
    if (path.startsWith("/inventory")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
        // Check if email is verified
        if (!user.email_confirmed_at) {
            return NextResponse.redirect(new URL("/verify-email", request.url))
        }
    }

    // Handle verify-email page
    if (path.startsWith("/verify-email")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
        if (user.email_confirmed_at) {
            return NextResponse.redirect(new URL("/inventory", request.url))
        }
    }

    // Redirect logged-in users away from login page
    if (path.startsWith("/login") && user) {
        if (!user.email_confirmed_at) {
            return NextResponse.redirect(new URL("/verify-email", request.url))
        }
        return NextResponse.redirect(new URL("/inventory", request.url))
    }

    // Root path redirect - slightly different logic to handle initial load
    if (path === "/") {
        if (user) {
            if (!user.email_confirmed_at) {
                return NextResponse.redirect(new URL("/verify-email", request.url))
            }
            return NextResponse.redirect(new URL("/inventory", request.url))
        } else {
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    return response
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
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
