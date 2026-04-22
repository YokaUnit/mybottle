import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Check, ChevronRight, Mail, ShieldCheck, Sparkles, Store, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "加盟店のご案内",
  robots: { index: true, follow: true },
};

const painPoints = [
  "ボトルキープの管理がアナログで、引き継ぎが属人化しやすい",
  "来店前にお客様へ価値を伝える導線が弱い",
  "新規獲得だけでなく、リピート率を上げたい",
];

const values = [
  {
    icon: Store,
    title: "既存オペそのまま",
    description: "店頭決済・伝票記入を維持。新しいレジ運用を増やしません。",
  },
  {
    icon: Users,
    title: "来店・常連化を促進",
    description: "割引と所有感で再来店理由を作り、指名来店を増やします。",
  },
  {
    icon: ShieldCheck,
    title: "提示確認で運用しやすい",
    description: "購入証明画面を見せるだけ。提供判断は店舗ルールを尊重します。",
  },
];

const flow = [
  "加盟店情報と提供ボトルを設定",
  "お客様がアプリ上で店舗とボトルを選択",
  "来店時に店頭で決済・スタッフが確認",
  "スタッフは従来どおり伝票記入で提供",
];

const faqs = [
  {
    q: "店内オペレーションは大きく変わりますか？",
    a: "変わりません。初期運用では店頭決済・伝票運用を維持する前提で設計しています。",
  },
  {
    q: "どんな店舗に向いていますか？",
    a: "バー、ラウンジ、スナックなど、ボトル提供でリピート導線を強化したい店舗に向いています。",
  },
  {
    q: "導入費用はかかりますか？",
    a: "導入形態に応じて個別にご案内します。まずはヒアリング後に最適なプランをご提案します。",
  },
];

export default function StaffLandingPage() {
  return (
    <main className="relative min-h-dvh bg-black text-white">
      <Image
        src="/images/start_page.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-black/80" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
        <Link
          href="/login"
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white/95 ring-1 ring-white/20 backdrop-blur-sm transition active:opacity-90"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          ログインへ戻る
        </Link>

        <div className="flex flex-1 flex-col gap-5">
          <section className="space-y-3 text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            <p className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-emerald-200 ring-1 ring-emerald-300/30">
              <Sparkles className="h-3 w-3" aria-hidden />
              加盟店募集
            </p>
            <h1 className="text-[1.75rem] font-black leading-tight tracking-[-0.02em]">
              店のやり方を変えずに、
              <br />
              来店とリピートを増やす。
            </h1>
            <p className="text-sm font-semibold leading-relaxed text-white/88">
              mybottle は「決済DX」ではなく「運用DX」。
              <br />
              既存の店頭オペに寄り添う導入設計です。
            </p>
            <a
              href="mailto:support@mybottle.app?subject=mybottle%20%E5%8A%A0%E7%9B%A3%E5%BA%97%E5%B0%8E%E5%85%A5%E7%9B%B8%E8%AB%87"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 text-sm font-bold text-neutral-900 shadow-md transition active:bg-neutral-100"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              無料で導入相談する
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            </a>
          </section>

          <section className="space-y-2 rounded-2xl bg-black/35 p-4 ring-1 ring-white/15 backdrop-blur-md">
            <h2 className="text-sm font-bold text-white">こんな課題はありませんか？</h2>
            <ul className="space-y-2">
              {painPoints.map((point) => (
                <li key={point} className="flex gap-3 text-sm font-semibold leading-snug text-white/92">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/90 text-white">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold">mybottle が選ばれる理由</h2>
            <div className="space-y-2">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <article key={value.title} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-white">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <p className="text-sm font-bold">{value.title}</p>
                    </div>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-white/85">{value.description}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-md">
            <h2 className="text-sm font-bold">導入フロー（最短）</h2>
            <ol className="mt-3 space-y-2">
              {flow.map((step, index) => (
                <li key={step} className="flex gap-2 text-sm font-semibold text-white/90">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/90 text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold">よくある質問</h2>
            {faqs.map((item) => (
              <details
                key={item.q}
                className="rounded-xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur-md [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-white">{item.q}</summary>
                <p className="mt-2 text-xs font-medium leading-relaxed text-white/85">{item.a}</p>
              </details>
            ))}
          </section>

          <section className="sticky bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-10 mt-auto">
            <div className="rounded-2xl bg-neutral-950/85 p-3 ring-1 ring-white/20 backdrop-blur-md">
              <p className="text-center text-[11px] font-semibold text-white/75">まずは15分で導入可否を確認できます</p>
              <a
                href="mailto:support@mybottle.app?subject=mybottle%20%E5%8A%A0%E7%9B%A3%E5%BA%97%E5%B0%8E%E5%85%A5%E7%9B%B8%E8%AB%87"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-bold text-neutral-900 transition active:bg-neutral-100"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                加盟店の相談をする
              </a>
            </div>
          </section>
          </div>
      </div>
    </main>
  );
}
