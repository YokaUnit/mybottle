"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  ok: boolean;
  message: string;
};

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "ログイン状態を確認できませんでした。" };
  }

  const displayName = (formData.get("display_name")?.toString() ?? "").trim();
  const phone = (formData.get("phone")?.toString() ?? "").trim();

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: displayName || null,
    email: user.email ?? null,
    phone: phone || null,
    avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
  });

  if (error) {
    return { ok: false, message: "プロフィール更新に失敗しました。時間をおいて再度お試しください。" };
  }

  revalidatePath("/mypage");
  revalidatePath("/mypage/edit");
  return { ok: true, message: "プロフィールを更新しました。" };
}
