"use client";

import Link from "next/link";
import {
  BadgePercent,
  BarChart3,
  Beer,
  Check,
  ChevronDown,
  ChevronRight,
  FileDown,
  Home,
  Info,
  LayoutDashboard,
  Smartphone,
  Users,
} from "lucide-react";
import { AppShellBackground } from "@/components/mybottle/app-shell-background";
import { StoreLpCupKeepSection } from "@/components/mybottle/store-lp/store-lp-cup-keep-section";
import { StoreLpDashboardShowcase } from "@/components/mybottle/store-lp/store-lp-dashboard-showcase";
import { StoreLpHeader } from "@/components/mybottle/store-lp/store-lp-header";
import { useSectionSpy, type StoreLpSpySectionId, STORE_LP_SPY_SECTIONS } from "@/components/mybottle/store-lp/use-section-spy";
import "./store-lp.css";

const CONTACT_MAIL =
  "mailto:support@mybottle.app?subject=mybottle%20%E5%8A%A0%E7%9B%9F%E5%BA%97%E5%B0%8E%E5%85%A5%E7%9B%B8%E8%AB%87";
const MATERIALS_MAIL =
  "mailto:support@mybottle.app?subject=mybottle%20%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E8%B3%87%E6%96%99%E3%81%AE%E8%B3%87%E6%96%99%E8%AB%8B%E6%B1%82";

const BOTTOM_NAV: ReadonlyArray<{
  id: StoreLpSpySectionId;
  label: string;
  Icon: typeof Home;
}> = [
  { id: STORE_LP_SPY_SECTIONS[0], label: "ホーム", Icon: Home },
  { id: STORE_LP_SPY_SECTIONS[1], label: "管理画面", Icon: LayoutDashboard },
  { id: STORE_LP_SPY_SECTIONS[2], label: "杯数キープ", Icon: Beer },
  { id: STORE_LP_SPY_SECTIONS[3], label: "FAQ", Icon: Info },
];

const HERO_POINTS = [
  "お客様の常連化とリピート率UP",
  "ボトル管理の手間をゼロに削減",
  "データでお店の売上を最大化",
];

const FEATURES = [
  {
    Icon: Smartphone,
    title: "シンプルに、ラクラク",
    desc: "難しい操作は不要。ボトル提供の記録もスムーズに。",
  },
  {
    Icon: Users,
    title: "常連化・リピート率向上",
    desc: "お客様とのつながりを強化し、再来店のきっかけを作ります。",
  },
  {
    Icon: BarChart3,
    title: "データで売上最大化",
    desc: "利用状況や人気ボトルを分析し、売上アップに活用。",
  },
  {
    Icon: BadgePercent,
    title: "クーポンで集客支援",
    desc: "新規・リピーター獲得をサポートする特典設計が可能。",
  },
];

const TESTIMONIALS = [
  {
    store: "居酒屋 団らん",
    role: "店長",
    quote: "ボトル管理の手間が激減。スタッフの負担が減り、接客に集中できるようになりました。",
  },
  {
    store: "Bar Lumière",
    role: "オーナー",
    quote: "常連さんのリピート率が上がり、売上も前年比で伸びています。",
  },
  {
    store: "スナック 笑顔",
    role: "ママ",
    quote: "アプリ不要なのでお客様にも好評。伝票運用のまま始められました。",
  },
];

const PARTNERS = ["茅ヶ崎エリア", "Bar & Lounge", "Izakaya", "Snack", "Dining Bar"];

const FLOW = [
  "お問い合わせ・ヒアリング（無料）",
  "店舗情報とボトルメニューを設定",
  "スタッフ向けに簡単レクチャー",
  "お客様の利用開始・運用サポート",
];

const FAQS = [
  {
    q: "店内のオペレーションは変わりますか？",
    a: "店頭決済・伝票記入はそのまま。画面提示での確認を加えるだけの設計です。",
  },
  {
    q: "導入までどのくらいかかりますか？",
    a: "最短数日で開始可能です。店舗規模やメニュー数に応じて個別にご案内します。",
  },
  {
    q: "お客様はアプリのインストールが必要ですか？",
    a: "不要です。スマホのブラウザからそのままご利用いただけます。",
  },
];

function CheckIcon() {
  return (
    <span className="store-lp__check-icon" aria-hidden>
      <Check className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}

export function StoreLpClient() {
  const { activeId, scrollToSection } = useSectionSpy();

  return (
    <div className="store-lp">
      <AppShellBackground />
      <div className="store-lp__content">
        <StoreLpHeader />

      <div className="mx-auto w-full max-w-md px-5">
        {/* Hero — copy first, image last */}
        <section id="top" className="store-lp__section pt-5">
          <h1 className="store-lp__headline">
            <span className="store-lp__headline-line store-lp__headline-line--ink">ボトルキープの管理を、</span>
            <span className="store-lp__headline-line store-lp__headline-line--teal">もっとカンタンに。</span>
            <span className="store-lp__headline-line store-lp__headline-line--teal">もっと売上につなげる。</span>
          </h1>

          <ul className="mt-5 space-y-3">
            {HERO_POINTS.map((point) => (
              <li key={point} className="store-lp__check-item">
                <CheckIcon />
                {point}
              </li>
            ))}
          </ul>

          <div id="pricing" className="store-lp__section store-lp__pricing mt-6">
            <div>
              <p className="store-lp__pricing-label">初期費用</p>
              <p className="store-lp__pricing-value">
                0<small>円</small>
              </p>
            </div>
            <div>
              <p className="store-lp__pricing-label">月額</p>
              <p className="store-lp__pricing-value">
                4,980<small>円（税込）</small>
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <a href={CONTACT_MAIL} className="store-lp__cta">
              今すぐ加盟店としてはじめる
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
            </a>
            <a href={MATERIALS_MAIL} className="store-lp__cta-sub w-full">
              <FileDown className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              サービス資料をダウンロード
            </a>
          </div>
        </section>

        <StoreLpDashboardShowcase />

        <StoreLpCupKeepSection />

        {/* Features */}
        <section id="features" className="store-lp__section mt-12">
          <h2 className="store-lp__section-title">mybottleが選ばれる理由</h2>
          <div className="store-lp__feature-grid mt-4">
            {FEATURES.map(({ Icon, title, desc }) => (
              <article key={title} className="mb-surface bg-white/90 p-3.5 backdrop-blur-sm">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f0fdfa] text-[#0d9488]">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} aria-hidden />
                </span>
                <h3 className="mt-2 text-xs font-extrabold leading-snug text-[#334155]">{title}</h3>
                <p className="mt-1 text-[10px] font-medium leading-relaxed text-[#64748b]">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-12">
          <h2 className="store-lp__section-title">加盟店の声</h2>
          <div className="store-lp__testimonial-track mt-4 -mx-1 px-1">
            {TESTIMONIALS.map((item) => (
              <article
                key={item.store}
                className="store-lp__testimonial-card mb-surface bg-white/90 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#14b8a6] text-sm font-extrabold text-white">
                    {item.store.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-[#334155]">{item.store}</p>
                    <p className="text-[10px] font-bold text-[#64748b]">{item.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs font-medium leading-relaxed text-[#64748b]">「{item.quote}」</p>
              </article>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="mt-12">
          <h2 className="text-center text-xs font-extrabold text-[#94a3b8]">導入店舗（一部）</h2>
          <div className="store-lp__partner-row mt-3">
            {PARTNERS.map((name) => (
              <span
                key={name}
                className="shrink-0 rounded-xl bg-white/90 px-4 py-2.5 text-xs font-bold text-[#475569] ring-1 ring-[#e2e8f0] backdrop-blur-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* Flow */}
        <section id="flow" className="store-lp__section mt-12 mb-surface bg-[#f0fdfa]/90 p-5 backdrop-blur-sm">
          <h2 className="text-base font-extrabold text-[#115e59]">導入の流れ</h2>
          <ol className="mt-3 space-y-2.5">
            {FLOW.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm font-bold text-[#334155]">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#14b8a6] text-[11px] font-extrabold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* Final CTA */}
        <section className="mt-12 mb-surface bg-[#f0fdfa]/90 p-5 backdrop-blur-sm">
          <p className="text-sm font-extrabold leading-relaxed text-[#334155]">
            まずは無料で始めて、
            <br />
            効果を実感してください。
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-1">
            <div>
              <p className="text-[10px] font-bold text-[#64748b]">初期費用</p>
              <p className="text-2xl font-black text-[#0d9488]">0円</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#64748b]">月額</p>
              <p className="text-lg font-black text-[#0d9488]">
                4,980<span className="text-sm font-extrabold">円（税込）</span>
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <a href={CONTACT_MAIL} className="store-lp__cta">
              今すぐ加盟店としてはじめる
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
            </a>
            <a href={MATERIALS_MAIL} className="store-lp__cta-sub w-full">
              <FileDown className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              サービス資料をダウンロード
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="store-lp__section mt-12 pb-4">
          <h2 className="store-lp__section-title">よくある質問</h2>
          <p className="store-lp__faq-hint mt-2 text-center">
            <ChevronDown className="store-lp__faq-hint-icon" strokeWidth={2.5} aria-hidden />
            タップして回答を見る
          </p>
          <div className="mt-4 space-y-2">
            {FAQS.map((item) => (
              <details key={item.q} className="store-lp__faq-item mb-surface bg-white/90 backdrop-blur-sm">
                <summary className="store-lp__faq-summary">
                  <span className="store-lp__faq-question">{item.q}</span>
                  <span className="store-lp__faq-toggle" aria-hidden>
                    <ChevronDown className="store-lp__faq-chevron" strokeWidth={2.5} />
                  </span>
                </summary>
                <div className="store-lp__faq-answer">
                  <p className="text-xs font-medium leading-relaxed text-[#64748b]">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <footer className="mb-2 rounded-2xl bg-[#0d9488] px-5 py-8 text-center">
          <p className="text-[1.0625rem] font-extrabold leading-snug tracking-[-0.02em] text-white">
            伝票はそのまま。キープ管理だけ、ラクに。
          </p>
          <p className="mt-1.5 text-xs font-bold leading-relaxed text-[#ccfbf1]">
            オペを変えずに、常連さんの再来店と杯数管理を支えます。
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center justify-center gap-1 rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-[#0d9488] shadow-sm transition active:scale-[0.98]"
          >
            加盟店ログイン
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </Link>
        </footer>
      </div>

      <nav className="store-lp__bottom-nav" aria-label="ページ内ナビゲーション">
        <div className="store-lp__bottom-nav-grid">
          {BOTTOM_NAV.map((item) => {
            const active = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`store-lp__nav-btn ${active ? "store-lp__nav-btn--active" : ""}`}
                aria-current={active ? "true" : undefined}
              >
                <span className="store-lp__nav-icon-wrap" aria-hidden>
                  <item.Icon className="store-lp__nav-icon" strokeWidth={active ? 2.5 : 2} />
                </span>
                <span className="store-lp__nav-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      </div>
    </div>
  );
}
