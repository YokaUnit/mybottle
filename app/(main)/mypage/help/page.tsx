import { redirect } from "next/navigation";

export default function MyPageHelpRedirect() {
  redirect("/legal/contact");
}
