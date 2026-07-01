import { redirect } from "next/navigation";

export default function MyPageTermsRedirect() {
  redirect("/legal/terms");
}
