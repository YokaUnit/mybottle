import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function MyPagePrivacyPage() {
  const policySections = [
    {
      title: "1. 事業者情報",
      body: ["mybottle 運営（以下「当社」）は、本ポリシーに基づき個人情報を取り扱います。"],
    },
    {
      title: "2. 取得する情報",
      body: [
        "当社は、サービス提供にあたり、以下の情報を取得することがあります。",
        "アカウント情報（Google認証で取得される識別子、氏名、メールアドレス、プロフィール画像等）",
        "プロフィール情報（表示名、電話番号等、ユーザーが入力した情報）",
        "利用情報（保有ボトル情報、消費履歴、操作日時、アクセスログ等）",
        "問い合わせ情報（問い合わせ時の氏名、連絡先、問い合わせ内容）",
      ],
    },
    {
      title: "3. 利用目的",
      body: [
        "取得した情報は、以下の目的で利用します。",
        "本サービスの提供・本人確認・ログイン認証のため",
        "ボトル保有状態、利用履歴、店舗提示情報の管理のため",
        "不正利用防止、障害対応、セキュリティ確保のため",
        "問い合わせ対応、重要なお知らせ連絡のため",
        "利用状況分析および機能改善のため",
      ],
    },
    {
      title: "4. 第三者提供",
      body: [
        "当社は、法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。",
        "ただし、サービス提供に必要な範囲で、認証・インフラ提供事業者（例: Supabase、Google）へ情報を取り扱わせることがあります。",
      ],
    },
    {
      title: "5. 外部サービスの利用",
      body: [
        "本サービスは、Google OAuth による認証および Supabase を利用したデータ管理基盤を使用します。",
        "これら外部サービスにおける情報の取扱いは、各事業者の規約・ポリシーに従います。",
      ],
    },
    {
      title: "6. 安全管理措置",
      body: [
        "当社は、個人情報への不正アクセス、漏えい、滅失、毀損を防止するため、アクセス制御、認証管理、通信の保護等の合理的な安全管理措置を講じます。",
      ],
    },
    {
      title: "7. 保存期間",
      body: [
        "個人情報は、利用目的の達成に必要な期間保存し、不要となった場合は法令に従い適切に削除または匿名化します。",
      ],
    },
    {
      title: "8. 開示・訂正・削除等の請求",
      body: [
        "ユーザーは、自己の個人情報について、開示・訂正・追加・削除・利用停止等を請求できます。",
        "請求を希望する場合は、お問い合わせ窓口からご連絡ください。本人確認のうえ、法令に従って対応します。",
      ],
    },
    {
      title: "9. 未成年者の利用",
      body: [
        "未成年者が本サービスを利用する場合は、必要に応じて保護者の同意を得たうえで利用してください。",
      ],
    },
    {
      title: "10. ポリシーの変更",
      body: [
        "当社は、法令変更やサービス内容変更に応じて本ポリシーを改定することがあります。",
        "改定後の内容は、本サービス上で告知した時点または当社が定める効力発生日より適用されます。",
      ],
    },
    {
      title: "11. お問い合わせ窓口",
      body: ["個人情報の取扱いに関するお問い合わせは、アプリ内「お問い合わせ」ページからご連絡ください。"],
    },
  ];

  return (
    <main className="space-y-4 pb-4 pt-2">
      <header className="mb-surface flex items-center gap-3 p-5">
        <Link
          href="/mypage"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mb-muted)] text-[var(--mb-ink)]"
          aria-label="マイページへ戻る"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">
          プライバシーポリシー
        </h1>
      </header>

      <section className="mb-surface space-y-5 p-5 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
        <p className="text-xs text-[var(--mb-forest-light)]">最終更新日: 2026年4月22日</p>
        {policySections.map((section) => (
          <article key={section.title} className="space-y-2">
            <h2 className="text-sm font-semibold text-[var(--mb-ink)]">{section.title}</h2>
            {section.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </article>
        ))}
      </section>
    </main>
  );
}
