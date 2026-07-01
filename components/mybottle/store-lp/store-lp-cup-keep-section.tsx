import { Beer, GlassWater, Wine, ArrowRight } from "lucide-react";

const DRINK_TYPES = [
  { label: "ビール", emoji: "🍺" },
  { label: "ハイボール", emoji: "🥃" },
  { label: "サワー", emoji: "🍋" },
  { label: "焼酎", emoji: "🍶" },
  { label: "カクテル", emoji: "🍸" },
  { label: "ワイン", emoji: "🍷" },
] as const;

export function StoreLpCupKeepSection() {
  return (
    <section id="value" className="store-lp__section mt-12">
      <div className="mb-2 text-center">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#0d9488]">Why mybottle</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-[#334155]">
          杯数でキープできる、
          <br />
          新しいボトルキープ
        </h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[#64748b]">
          鏡月のような焼酎ボトルだけではなく、
          <br />
          ビールやグラス・ジョッキの飲み物も杯数で。
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        <article className="mb-surface bg-white/90 p-4 backdrop-blur-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#94a3b8]">従来</p>
          <p className="mt-1.5 text-sm font-extrabold text-[#64748b]">焼酎ボトル中心のキープ</p>
          <p className="mt-2 text-xs font-medium leading-relaxed text-[#94a3b8]">
            ボトル1本を預ける形式が中心。ビールやハイボールなど、グラス提供のメニューには向きにくかった。
          </p>
        </article>

        <div className="flex justify-center" aria-hidden>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f0fdfa] text-[#0d9488] ring-1 ring-[#99f6e4]">
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </div>

        <article className="mb-surface relative overflow-hidden bg-gradient-to-br from-[#f0fdfa] to-white p-4 backdrop-blur-sm ring-[#99f6e4]/60">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#0d9488]">mybottle</p>
          <p className="mt-1.5 text-sm font-extrabold text-[#115e59]">杯数でキープできる</p>
          <p className="mt-2 text-xs font-medium leading-relaxed text-[#475569]">
            「ハイボール10杯」「ビール5杯」など、お客様が普段飲むメニューをそのまま杯数で管理。提供のたびに1杯ずつ減算。
          </p>
        </article>
      </div>

      <div className="mt-5 mb-surface bg-white/90 p-4 backdrop-blur-sm">
        <p className="text-center text-xs font-extrabold text-[#334155]">こんな飲み物も、杯数キープの対象に</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {DRINK_TYPES.map((d) => (
            <span
              key={d.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f8fafc] px-3 py-1.5 text-xs font-bold text-[#334155] ring-1 ring-[#e2e8f0]"
            >
              <span aria-hidden>{d.emoji}</span>
              {d.label}
            </span>
          ))}
        </div>
      </div>

      <ul className="mt-4 space-y-2.5">
        {[
          {
            Icon: Beer,
            title: "ビール・ハイボールも",
            desc: "ジョッキやグラスで出す定番メニューを、そのままキープの単位にできる",
          },
          {
            Icon: GlassWater,
            title: "杯数でわかりやすい",
            desc: "お客様もスタッフも「残り何杯」と一目で共有。伝票とも照合しやすい",
          },
          {
            Icon: Wine,
            title: "店のメニューに合わせて",
            desc: "焼酎ボトルに加え、店舗の主力ドリンクを自由に設定できる",
          },
        ].map(({ Icon, title, desc }) => (
          <li key={title} className="flex gap-3 rounded-xl bg-white/85 p-3.5 backdrop-blur-sm ring-1 ring-[#e2e8f0]/80">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ecfdf5] text-[#0d9488]">
              <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            </span>
            <div>
              <p className="text-sm font-extrabold text-[#334155]">{title}</p>
              <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-[#64748b]">{desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center text-[11px] font-medium leading-relaxed text-[#94a3b8]">
        ※ 鏡月などの焼酎ボトルキープとも併用できます
      </p>
    </section>
  );
}
