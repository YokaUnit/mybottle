/**
 * 全画面共通のミニマル背景。
 * シャボン玉風の球をばらばらに配置し、ゆるく浮遊させる。
 */
export function AppShellBackground() {
  return (
    <div className="mb-app-shell-bg" aria-hidden>
      <svg
        className="mb-app-shell-bg__scene"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="mb-shell-bubble-mint" cx="32%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#a7f3d0" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#5eead4" stopOpacity="0.14" />
          </radialGradient>
          <radialGradient id="mb-shell-bubble-cream" cx="30%" cy="26%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.52" />
            <stop offset="55%" stopColor="#fde68a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.12" />
          </radialGradient>
        </defs>

        <Bubble cx={376} cy={108} r={20} tone="mint" className="mb-app-shell-bg__bubble--1" />
        <Bubble cx={338} cy={248} r={14} tone="cream" className="mb-app-shell-bg__bubble--2" />
        <Bubble cx={364} cy={396} r={18} tone="mint" className="mb-app-shell-bg__bubble--3" />
        <Bubble cx={312} cy={548} r={13} tone="cream" className="mb-app-shell-bg__bubble--4" />
        <Bubble cx={380} cy={688} r={17} tone="mint" className="mb-app-shell-bg__bubble--5" />
        <Bubble cx={34} cy={88} r={16} tone="cream" className="mb-app-shell-bg__bubble--6" />
        <Bubble cx={52} cy={268} r={12} tone="mint" className="mb-app-shell-bg__bubble--7" />
        <Bubble cx={22} cy={438} r={19} tone="cream" className="mb-app-shell-bg__bubble--8" />
        <Bubble cx={68} cy={612} r={15} tone="mint" className="mb-app-shell-bg__bubble--9" />
        <Bubble cx={248} cy={748} r={14} tone="cream" className="mb-app-shell-bg__bubble--10" />
        <Bubble cx={128} cy={178} r={11} tone="mint" className="mb-app-shell-bg__bubble--11" />
        <Bubble cx={268} cy={468} r={16} tone="cream" className="mb-app-shell-bg__bubble--12" />
      </svg>
    </div>
  );
}

type BubbleProps = {
  cx: number;
  cy: number;
  r: number;
  tone: "mint" | "cream";
  className: string;
};

function Bubble({ cx, cy, r, tone, className }: BubbleProps) {
  const fill = tone === "mint" ? "url(#mb-shell-bubble-mint)" : "url(#mb-shell-bubble-cream)";
  const stroke = tone === "mint" ? "#2dd4bf" : "#fbbf24";

  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g className={`mb-app-shell-bg__bubble ${className}`}>
        <circle r={r} fill={fill} stroke={stroke} strokeOpacity={0.26} strokeWidth={0.75} />
        <circle cx={-r * 0.28} cy={-r * 0.32} r={r * 0.24} fill="#ffffff" fillOpacity={0.42} />
      </g>
    </g>
  );
}
