import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { POST_LOGIN_BOOT_COOKIE } from "@/lib/post-login-boot";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";
  const safeNext = next.startsWith("/") ? next : "/";

  if (!code) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("auth_error", error.code ?? "exchange_failed");
    return NextResponse.redirect(loginUrl);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("profiles").upsert({
      id: user.id,
      display_name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
      email: user.email ?? null,
      phone: user.phone ?? null,
    });
  }

  const redirectUrl = new URL(safeNext, url.origin);
  const res = NextResponse.redirect(redirectUrl);
  /** 初回 HTML からホームが一瞬見えないようサーバー側でロックする（クライアントで解除） */
  res.cookies.set({
    name: POST_LOGIN_BOOT_COOKIE,
    value: "1",
    path: "/",
    maxAge: 120,
    sameSite: "lax",
    httpOnly: false,
  });
  return res;
}
