/** OAuth 直後の初回在庫ブート（サーバーが HTML で隠し、クライアントが解除する） */
export const POST_LOGIN_BOOT_COOKIE = "mb_post_login_boot";

export function hasPostLoginBootCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${POST_LOGIN_BOOT_COOKIE}=`));
}

export function clearPostLoginBootCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${POST_LOGIN_BOOT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/** ログイン直後ブートの最短表示時間（ms） */
export const POST_LOGIN_BOOT_MIN_MS = 2000;
