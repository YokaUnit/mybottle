export function resolveLegalBackHref(back?: string) {
  if (back === "mypage") return "/mypage";
  return "/login";
}
