import Image from "next/image";
import { Gift, History, KeyRound, LayoutDashboard, TrendingUp, Wine } from "lucide-react";

const METRICS = [
  { label: "利用中ボトル", value: "24本" },
  { label: "今月の提供数", value: "186回" },
  { label: "今月の販売", value: "¥285,300" },
] as const;

const CAPABILITIES = [
  {
    Icon: Wine,
    title: "ボトル管理",
    desc: "価格・販売設定をその場で変更",
  },
  {
    Icon: KeyRound,
    title: "購入確認 PIN",
    desc: "店頭購入をスタッフが安全に承認",
  },
  {
    Icon: History,
    title: "利用履歴",
    desc: "いつ・誰が・何杯使ったかを一覧",
  },
  {
    Icon: Gift,
    title: "特典・クーポン",
    desc: "来店促進の施策を配信・管理",
  },
] as const;

export function StoreLpDashboardShowcase() {
  return (
    <section id="dashboard" className="store-lp__section store-lp__showcase-section mt-10">
      <div className="mb-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#0d9488]">Store Dashboard</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-[#334155]">
          店舗スタッフ向けダッシュボード
        </h2>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-[#64748b]">
          スマホひとつで、売上・提供・ボトル設定まで。難しい操作は不要です。
        </p>
      </div>

      <div className="store-lp__showcase">
        <div className="store-lp__showcase-dash">
          <div className="store-lp__phone">
            <div className="store-lp__phone-notch" aria-hidden />
            <div className="store-lp__phone-screen">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#64748b]">Store</p>
                  <p className="text-xs font-extrabold text-[#0d4f4a]">茅ヶ崎店</p>
                </div>
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0a403b] text-[#fde047]">
                  <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {METRICS.map((m) => (
                  <div key={m.label} className="rounded-xl bg-[#f8fafc] px-3 py-2 ring-1 ring-[#e2e8f0]">
                    <p className="text-[8px] font-bold text-[#64748b]">{m.label}</p>
                    <p className="text-sm font-extrabold text-[#0d4f4a]">{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {CAPABILITIES.map(({ Icon, title }) => (
                  <div
                    key={title}
                    className="flex items-center gap-1.5 rounded-lg bg-[#f0fdfa] px-2 py-1.5 ring-1 ring-[#99f6e4]/40"
                  >
                    <Icon className="h-3 w-3 shrink-0 text-[#0d9488]" strokeWidth={2.25} aria-hidden />
                    <span className="text-[8px] font-extrabold leading-tight text-[#115e59]">{title}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-1 rounded-lg bg-[#0a403b] px-2 py-1.5">
                <TrendingUp className="h-3 w-3 text-[#fde047]" strokeWidth={2.25} aria-hidden />
                <p className="text-[8px] font-bold text-white/90">今月の提供数 +24%（前月比）</p>
              </div>
            </div>
          </div>
        </div>

        <div className="store-lp__showcase-staff" aria-hidden>
          <Image
            src="/images/lp_image.webp"
            alt=""
            width={640}
            height={800}
            className="store-lp__showcase-staff-img"
            sizes="(max-width: 390px) 45vw, 200px"
            priority
          />
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-2">
        {CAPABILITIES.map(({ Icon, title, desc }) => (
          <li key={title} className="rounded-xl border border-[#e2e8f0] bg-white p-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f0fdfa] text-[#0d9488]">
                <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              </span>
              <p className="text-xs font-extrabold text-[#334155]">{title}</p>
            </div>
            <p className="mt-1.5 text-[10px] font-medium leading-relaxed text-[#64748b]">{desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
