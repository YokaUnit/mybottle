type ArtProps = {
  className?: string;
};

export function LoginShopArt({ className = "h-16 w-16" }: ArtProps) {
  return (
    <svg viewBox="0 0 88 88" className={className} aria-hidden>
      <path
        d="M12 38 L44 22 L76 38"
        fill="#86efac"
        stroke="#14b8a6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 38 H76" stroke="#14b8a6" strokeWidth="2" />
      <path
        d="M14 38 V38 H30 V38"
        stroke="#14b8a6"
        strokeWidth="0"
        fill="none"
      />
      {[16, 24, 32, 40, 48, 56, 64].map((x) => (
        <line
          key={x}
          x1={x}
          y1="26"
          x2={x + 6}
          y2="38"
          stroke="#14b8a6"
          strokeWidth="1.8"
          opacity="0.35"
        />
      ))}
      <rect x="16" y="38" width="56" height="36" rx="4" fill="#fff" stroke="#14b8a6" strokeWidth="2" />
      <rect x="24" y="46" width="16" height="22" rx="2" fill="#e0f2fe" stroke="#14b8a6" strokeWidth="1.5" />
      <rect x="50" y="50" width="16" height="18" rx="2" fill="#fef3c7" stroke="#ca8a04" strokeWidth="1.5" />
      <line x1="58" y1="54" x2="58" y2="62" stroke="#92400e" strokeWidth="1.2" />
      <line x1="54" y1="58" x2="62" y2="58" stroke="#92400e" strokeWidth="1.2" />
      <ellipse cx="18" cy="68" rx="5" ry="3" fill="#86efac" stroke="#14b8a6" strokeWidth="1.2" />
      <path d="M16 66 Q18 62 20 66" stroke="#14b8a6" strokeWidth="1" fill="none" />
      <path
        d="M46 18 L48 14 L50 18 L54 19 L50 20 L48 24 L46 20 L42 19 Z"
        fill="#facc15"
        stroke="#eab308"
        strokeWidth="0.8"
      />
      <path
        d="M58 16 L59 13 L60 16 L63 17 L60 18 L59 21 L58 18 L55 17 Z"
        fill="#facc15"
        opacity="0.85"
      />
    </svg>
  );
}
