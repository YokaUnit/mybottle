import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function isPublicPath(pathname: string) {
  if (pathname === "/login") return true;
  if (pathname === "/staff") return true;
  if (pathname.startsWith("/auth/callback")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/images/")) return true;
  if (pathname === "/favicon.ico") return true;
  if (/\.(ico|png|jpg|jpeg|gif|webp|svg|txt|webmanifest)$/i.test(pathname)) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const hasOAuthCode = request.nextUrl.searchParams.has("code");
    if (hasOAuthCode && pathname !== "/auth/callback") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/callback";
      if (!url.searchParams.has("next")) {
        url.searchParams.set("next", "/");
      }
      return NextResponse.redirect(url);
    }

    const response = NextResponse.next({ request });
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let hasAuthSession = false;
    let currentUserId: string | null = null;
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();
      hasAuthSession = Boolean(user);
      currentUserId = user?.id ?? null;

      if (pathname.startsWith("/admin") && user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        if (profile?.role !== "admin") {
          const url = request.nextUrl.clone();
          url.pathname = "/";
          return NextResponse.redirect(url);
        }
      }
    }

    if (pathname === "/login" && hasAuthSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (isPublicPath(pathname)) {
      return response;
    }

    if (!hasAuthSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin") && currentUserId) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    }

    return response;
  } catch {
    // Never break request flow due to proxy runtime issues.
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
