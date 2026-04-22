import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MB_SESSION_COOKIE = "mb_session";

function isPublicPath(pathname: string) {
  if (pathname === "/login") return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/images/")) return true;
  if (pathname === "/favicon.ico") return true;
  if (/\.(ico|png|jpg|jpeg|gif|webp|svg|txt|webmanifest)$/i.test(pathname)) return true;
  return false;
}

export function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get(MB_SESSION_COOKIE)?.value;

    if (pathname === "/login" && session) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }

    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    // Never break request flow due to proxy runtime issues.
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
