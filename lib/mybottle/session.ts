/** ミドルウェアとクライアントで共有（アプリ内ルート通過用・認証の代替ではない） */
export const MB_SESSION_COOKIE = "mb_session";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function persistBrowserSession(mode: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${MB_SESSION_COOKIE}=${encodeURIComponent(mode)}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
}

export function clearBrowserSession() {
  if (typeof document === "undefined") return;
  document.cookie = `${MB_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
