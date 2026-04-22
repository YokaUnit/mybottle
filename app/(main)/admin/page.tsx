import { unstable_noStore as noStore } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import {
  createBenefitNewsAction,
  deleteBenefitNewsAction,
  toggleStoreActiveAction,
  updateBenefitNewsAction,
  updateProductAction,
  updateStoreUiMetaAction,
  updateUserRoleAction,
} from "@/app/(main)/admin/actions";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ProfileAdminRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: "user" | "staff" | "admin";
  created_at: string;
};

type StoreAdminRow = {
  id: string;
  name: string;
  area: string;
  is_active: boolean;
};

type StoreUiAdminRow = {
  store_id: string;
  image_src: string;
  intro: string;
  features: unknown;
  open_hours: string;
};

type ProductAdminRow = {
  id: string;
  name: string;
  category: string;
  type: "virtual" | "physical";
  price_jpy: number;
  bundle_size: number;
  description: string;
  is_active: boolean;
};

type BenefitNewsAdminRow = {
  id: string;
  badge_label: string;
  title: string;
  body: string;
  sort_order: number;
  is_active: boolean;
};

export default async function AdminPage() {
  noStore();
  const { role } = await requireRole(["admin"]);
  const [{ data: profiles }, { data: stores }, { data: storeUiRows }, { data: products }, { data: benefitNewsRows }] =
    await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id,email,display_name,role,created_at")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin.from("stores").select("id,name,area,is_active").order("name"),
      supabaseAdmin.from("store_ui_meta").select("store_id,image_src,intro,features,open_hours"),
      supabaseAdmin.from("products").select("id,name,category,type,price_jpy,bundle_size,description,is_active").order("name"),
      supabaseAdmin.from("benefit_news").select("id,badge_label,title,body,sort_order,is_active").order("sort_order", {
        ascending: false,
      }),
    ]);

  const storeUiById = Object.fromEntries(
    (storeUiRows ?? []).map((row) => [row.store_id, row as StoreUiAdminRow]),
  ) as Record<string, StoreUiAdminRow>;

  return (
    <main className="space-y-4 pb-4 pt-2">
      <header className="mb-surface p-5">
        <h1 className="mb-screen-title">管理者ページ</h1>
        <p className="mt-1 text-sm font-medium text-[var(--mb-forest-light)]">
          ロール: <span className="font-semibold text-[var(--mb-accent-dark)]">{role}</span>
        </p>
      </header>
      <section className="mb-surface p-5 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
        管理者向け機能のベースページです。ここに店舗・商品・ユーザー管理機能を追加していきます。
      </section>

      <section className="mb-surface p-5">
        <details className="[&_summary::-webkit-details-marker]:hidden">
          <summary className="list-none cursor-pointer">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[var(--mb-ink)]">ユーザーロール管理</h2>
              <span className="text-xs font-semibold text-[var(--mb-forest-light)]">▼ 開く</span>
            </div>
            <p className="mt-1 text-xs font-medium text-[var(--mb-forest-light)]">
              権限を user / staff / admin に変更できます。
            </p>
          </summary>
          <div className="mt-3 space-y-2">
            {((profiles as ProfileAdminRow[] | null) ?? []).map((user) => (
              <form
                key={user.id}
                action={updateUserRoleAction}
                className="rounded-lg border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-3"
              >
                <input type="hidden" name="user_id" value={user.id} />
                <p className="text-sm font-semibold text-[var(--mb-ink)]">{user.display_name ?? "名前未設定"}</p>
                <p className="text-xs text-[var(--mb-forest-light)]">{user.email ?? "メール未設定"}</p>
                <div className="mt-2 flex items-center gap-2">
                  <select
                    name="role"
                    defaultValue={user.role}
                    className="h-9 rounded-md border border-[var(--mb-ring)] bg-white px-2 text-sm"
                  >
                    <option value="user">user</option>
                    <option value="staff">staff</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--mb-forest)] px-3 py-2 text-xs font-semibold text-white"
                  >
                    権限を更新
                  </button>
                </div>
              </form>
            ))}
          </div>
        </details>
      </section>

      <section className="mb-surface p-5">
        <details className="[&_summary::-webkit-details-marker]:hidden">
          <summary className="list-none cursor-pointer">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[var(--mb-ink)]">店舗公開管理</h2>
              <span className="text-xs font-semibold text-[var(--mb-forest-light)]">▼ 開く</span>
            </div>
            <p className="mt-1 text-xs font-medium text-[var(--mb-forest-light)]">
              店舗の公開状態と店舗表示情報を管理します。
            </p>
          </summary>
          <div className="mt-3 space-y-3">
            {((stores as StoreAdminRow[] | null) ?? []).map((store) => {
              const storeUi = storeUiById[store.id];
              const featuresCsv = Array.isArray(storeUi?.features)
                ? storeUi.features.filter((v): v is string => typeof v === "string").join(", ")
                : "";
              return (
                <article key={store.id} className="rounded-lg border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--mb-ink)]">{store.name}</p>
                      <p className="text-xs text-[var(--mb-forest-light)]">{store.area}</p>
                    </div>
                    <form action={toggleStoreActiveAction}>
                      <input type="hidden" name="store_id" value={store.id} />
                      <input type="hidden" name="next_active" value={store.is_active ? "false" : "true"} />
                      <button
                        type="submit"
                        className="rounded-full border border-[var(--mb-ring)] bg-white px-3 py-2 text-xs font-semibold"
                      >
                        {store.is_active ? "非公開にする" : "公開する"}
                      </button>
                    </form>
                  </div>

                  <form action={updateStoreUiMetaAction} className="mt-3 space-y-2">
                    <input type="hidden" name="store_id" value={store.id} />
                    <input
                      name="open_hours"
                      defaultValue={storeUi?.open_hours ?? "-"}
                      className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                      placeholder="営業時間"
                    />
                    <input
                      name="image_src"
                      defaultValue={storeUi?.image_src ?? "/store/test1.png"}
                      className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                      placeholder="画像パス"
                    />
                    <input
                      name="features_csv"
                      defaultValue={featuresCsv}
                      className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                      placeholder="特徴（カンマ区切り）"
                    />
                    <textarea
                      name="intro"
                      defaultValue={storeUi?.intro ?? ""}
                      rows={2}
                      className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                      placeholder="店舗紹介"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[var(--mb-forest)] px-3 py-2 text-xs font-semibold text-white"
                    >
                      店舗表示情報を保存
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        </details>
      </section>

      <section className="mb-surface p-5">
        <details className="[&_summary::-webkit-details-marker]:hidden">
          <summary className="list-none cursor-pointer">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[var(--mb-ink)]">商品管理</h2>
              <span className="text-xs font-semibold text-[var(--mb-forest-light)]">▼ 開く</span>
            </div>
            <p className="mt-1 text-xs font-medium text-[var(--mb-forest-light)]">
              価格、セット本数、説明文、公開状態を更新できます。
            </p>
          </summary>
          <div className="mt-3 space-y-2">
            {((products as ProductAdminRow[] | null) ?? []).map((product) => (
              <form
                key={product.id}
                action={updateProductAction}
                className="rounded-lg border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-3"
              >
                <input type="hidden" name="product_id" value={product.id} />
                <p className="text-sm font-semibold text-[var(--mb-ink)]">{product.name}</p>
                <p className="text-xs text-[var(--mb-forest-light)]">
                  {product.category} / {product.type}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    name="price_jpy"
                    type="number"
                    min={0}
                    defaultValue={product.price_jpy}
                    className="rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                    placeholder="価格"
                  />
                  <input
                    name="bundle_size"
                    type="number"
                    min={1}
                    defaultValue={product.bundle_size}
                    className="rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                    placeholder="セット本数"
                  />
                </div>
                <textarea
                  name="description"
                  defaultValue={product.description}
                  rows={2}
                  className="mt-2 w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                  placeholder="説明"
                />
                <div className="mt-2 flex items-center gap-2">
                  <select
                    name="is_active"
                    defaultValue={product.is_active ? "true" : "false"}
                    className="h-9 rounded-md border border-[var(--mb-ring)] bg-white px-2 text-sm"
                  >
                    <option value="true">公開</option>
                    <option value="false">非公開</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--mb-forest)] px-3 py-2 text-xs font-semibold text-white"
                  >
                    商品を更新
                  </button>
                </div>
              </form>
            ))}
          </div>
        </details>
      </section>

      <section className="mb-surface p-5">
        <details className="[&_summary::-webkit-details-marker]:hidden">
          <summary className="list-none cursor-pointer">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[var(--mb-ink)]">特典ページのニュース</h2>
              <span className="text-xs font-semibold text-[var(--mb-forest-light)]">▼ 開く</span>
            </div>
            <p className="mt-1 text-xs font-medium text-[var(--mb-forest-light)]">
              表示は公開中のみ。一覧は折りたたみです（初期は閉じています）。
            </p>
          </summary>

          <div className="mt-3 space-y-3">
            <details className="rounded-lg border border-[var(--mb-ring)] bg-[var(--mb-muted)] [&_summary::-webkit-details-marker]:hidden">
              <summary className="cursor-pointer list-none px-3 py-3 text-sm font-semibold text-[var(--mb-ink)]">
                ＋ 新しいニュースを追加
              </summary>
              <form action={createBenefitNewsAction} className="space-y-2 border-t border-[var(--mb-ring)] p-3">
                <input
                  name="badge_label"
                  className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                  placeholder="ラベル（例: アプリ更新）"
                />
                <input
                  name="title"
                  required
                  className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                  placeholder="タイトル"
                />
                <textarea
                  name="body"
                  required
                  rows={3}
                  className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                  placeholder="本文"
                />
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={0}
                  className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                  placeholder="並び順（小さいほど上）"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[var(--mb-forest)] px-3 py-2 text-xs font-semibold text-white"
                >
                  追加する
                </button>
              </form>
            </details>

            <div className="space-y-2">
              {((benefitNewsRows as BenefitNewsAdminRow[] | null) ?? []).map((row) => (
                <details
                  key={row.id}
                  className="rounded-lg border border-[var(--mb-ring)] bg-[var(--mb-muted)] [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-3 text-left">
                    <span className="min-w-0 truncate text-sm font-semibold text-[var(--mb-ink)]">{row.title}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        row.is_active ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {row.is_active ? "公開" : "非公開"}
                    </span>
                  </summary>
                  <div className="space-y-3 border-t border-[var(--mb-ring)] p-3">
                    <form action={updateBenefitNewsAction} className="space-y-2">
                      <input type="hidden" name="id" value={row.id} />
                      <input
                        name="badge_label"
                        defaultValue={row.badge_label}
                        className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                        placeholder="ラベル"
                      />
                      <input
                        name="title"
                        required
                        defaultValue={row.title}
                        className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                        placeholder="タイトル"
                      />
                      <textarea
                        name="body"
                        required
                        rows={3}
                        defaultValue={row.body}
                        className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                        placeholder="本文"
                      />
                      <input
                        name="sort_order"
                        type="number"
                        defaultValue={row.sort_order}
                        className="w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                        placeholder="並び順"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          name="is_active"
                          defaultValue={row.is_active ? "true" : "false"}
                          className="h-9 rounded-md border border-[var(--mb-ring)] bg-white px-2 text-sm"
                        >
                          <option value="true">公開</option>
                          <option value="false">非公開</option>
                        </select>
                        <button
                          type="submit"
                          className="rounded-full bg-[var(--mb-forest)] px-3 py-2 text-xs font-semibold text-white"
                        >
                          保存
                        </button>
                      </div>
                    </form>
                    <form action={deleteBenefitNewsAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <button
                        type="submit"
                        className="text-xs font-semibold text-red-700 underline-offset-2 hover:underline"
                      >
                        このニュースを削除
                      </button>
                    </form>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </details>
      </section>
    </main>
  );
}
