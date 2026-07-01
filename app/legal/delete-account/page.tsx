import { redirect } from "next/navigation";
import { DeleteAccountClient } from "@/components/mybottle/legal/delete-account-client";
import { LegalDocumentPage } from "@/components/mybottle/legal/legal-document-page";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const metadata = {
  title: "退会",
  robots: { index: false, follow: false },
};

export default async function LegalDeleteAccountPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/legal/delete-account");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";
  let isLastAdmin = false;
  if (isAdmin) {
    const { count } = await supabaseAdmin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    isLastAdmin = (count ?? 0) <= 1;
  }

  return (
    <LegalDocumentPage
      document={{
        title: "退会（アカウント削除）",
        description:
          "アカウントを削除すると、保有ボトル・利用履歴・友だち関係などのデータは復元できません。",
        sections: [
          {
            title: "削除されるデータ",
            body: ["退会手続き完了後、以下のデータが削除されます。"],
            list: [
              "アカウント情報（メールアドレス、表示名等）",
              "保有ボトル・残量データ",
              "購入・利用・送信の履歴",
              "友だち関係・ブロック情報",
            ],
          },
          {
            title: "削除されない場合があるもの",
            body: [
              "店舗での伝票・実物のボトルキープ記録は店舗側に残る場合があります。",
              "法令上保存が必要な情報は、所定の期間保存したうえで削除します。",
            ],
          },
        ],
      }}
      backHref="/mypage"
      backLabel="マイページへ戻る"
    >
      <DeleteAccountClient
        userEmail={profile?.email ?? user.email ?? ""}
        isAdmin={isAdmin}
        isLastAdmin={isLastAdmin}
      />
    </LegalDocumentPage>
  );
}
