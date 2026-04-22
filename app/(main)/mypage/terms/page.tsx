import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function MyPageTermsPage() {
  const termsSections = [
    {
      title: "第1条（適用）",
      body: [
        "本規約は、mybottle（以下「本サービス」）の利用条件を定めるものです。",
        "ユーザーは、本規約に同意したうえで本サービスを利用するものとします。",
      ],
    },
    {
      title: "第2条（サービス内容）",
      body: [
        "本サービスは、店舗でのボトルキープ運用を補助するため、購入・保有・消費状態の表示および管理機能を提供します。",
        "本サービス上の表示は店舗運用を補助する情報であり、最終的な提供可否や精算可否は店舗の判断に従います。",
      ],
    },
    {
      title: "第3条（アカウント登録）",
      body: [
        "ユーザーは、当社が定める認証手段（Google認証等）によりアカウントを登録します。",
        "ユーザーは、登録情報を正確かつ最新に保つものとし、第三者への貸与・譲渡・共有をしてはいけません。",
      ],
    },
    {
      title: "第4条（店頭決済）",
      body: [
        "本サービスの初期提供では、サイト内オンライン決済を行いません。",
        "代金の支払いは、各店舗が採用する決済手段（現金・カード・QR等）により店頭で行われます。",
        "支払い・返金・領収書等の精算実務は、各店舗のルールに従います。",
      ],
    },
    {
      title: "第5条（店舗との関係）",
      body: [
        "店舗でのボトル販売契約は、ユーザーと店舗との間で成立します。",
        "店舗都合（在庫切れ、営業時間変更、提供条件変更等）による影響について、当社は合理的範囲で情報連携しますが、店舗判断を優先します。",
      ],
    },
    {
      title: "第6条（禁止事項）",
      body: [
        "ユーザーは、以下の行為をしてはなりません。",
        "法令または公序良俗に反する行為、不正アクセス、なりすまし、スクリーンショット等を用いた不正利用、他者の権利侵害、サービス運営を妨害する行為。",
      ],
    },
    {
      title: "第7条（利用停止等）",
      body: [
        "当社は、規約違反または不正利用の疑いがある場合、事前通知なくアカウント停止・機能制限・データ確認等の措置を行うことがあります。",
      ],
    },
    {
      title: "第8条（知的財産権）",
      body: [
        "本サービスに関するプログラム、デザイン、ロゴ、テキスト等の権利は、当社または正当な権利者に帰属します。",
      ],
    },
    {
      title: "第9条（免責）",
      body: [
        "当社は、本サービスの中断・停止・障害・データ消失が生じないことを保証しません。",
        "当社は、店舗との個別取引、店舗提供内容、第三者サービス起因の損害について、当社に故意または重過失がある場合を除き責任を負いません。",
      ],
    },
    {
      title: "第10条（サービス変更・終了）",
      body: [
        "当社は、ユーザーへの周知のうえ、本サービスの内容を変更または終了できるものとします。",
      ],
    },
    {
      title: "第11条（規約変更）",
      body: [
        "当社は、必要に応じて本規約を変更できます。変更後は、本サービス上に表示した時点または当社が定める効力発生日より適用されます。",
      ],
    },
    {
      title: "第12条（準拠法・裁判管轄）",
      body: [
        "本規約は日本法に準拠します。",
        "本サービスに関して紛争が生じた場合、当社本店所在地を管轄する地方裁判所を第一審の専属的合意管轄裁判所とします。",
      ],
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
        <h1 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">利用規約</h1>
      </header>

      <section className="mb-surface space-y-5 p-5 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
        <p className="text-xs text-[var(--mb-forest-light)]">最終更新日: 2026年4月22日</p>
        {termsSections.map((section) => (
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
