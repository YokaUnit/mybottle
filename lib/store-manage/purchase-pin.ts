import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getStoreName(storeId: string): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("stores").select("name").eq("id", storeId).maybeSingle();
  return (data?.name as string | undefined) ?? "店舗";
}

export async function assertStoreStaffPinValid(
  storeId: string,
  pinCode: string | undefined,
): Promise<void> {
  const normalized = String(pinCode ?? "").padStart(4, "0").slice(-4);
  if (!/^\d{4}$/.test(normalized)) {
    throw new Error("PINを入力してください");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("verify_store_staff_pin", {
    p_store_id: storeId,
    p_pin_code: normalized,
  });

  if (error) throw new Error("PINの確認に失敗しました");
  if (!data) throw new Error("PINが正しくありません。店員に確認してください");
}
