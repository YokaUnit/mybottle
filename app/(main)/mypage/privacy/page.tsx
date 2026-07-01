import { redirect } from "next/navigation";

export default function MyPagePrivacyRedirect() {
  redirect("/legal/privacy");
}
