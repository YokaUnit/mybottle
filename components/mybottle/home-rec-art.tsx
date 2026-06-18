type ArtProps = {
  className?: string;
};

export function RecCouponArt({ className = "h-14 w-14" }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <ellipse cx="30" cy="54" rx="14" ry="3.5" fill="#14b8a6" opacity="0.12" />
      <rect x="16" y="30" width="28" height="20" rx="3" fill="#ffffff" stroke="#99f6e4" strokeWidth="1.5" />
      <rect x="14" y="22" width="32" height="10" rx="2" fill="#f0fdfa" stroke="#5eead4" strokeWidth="1.5" />
      <rect x="30" y="22" width="4" height="28" fill="#2dd4bf" opacity="0.85" />
      <path d="M30 22c-5-3.5-9-3.5-11-1.5s-1 5.5 5.5 5.5H30V22z" fill="#ccfbf1" stroke="#2dd4bf" strokeWidth="1" />
      <path d="M30 22c5-3.5 9-3.5 11-1.5s1 5.5-5.5 5.5H30V22z" fill="#ccfbf1" stroke="#2dd4bf" strokeWidth="1" />
    </svg>
  );
}

export function RecCoinsArt({ className = "h-14 w-14" }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <ellipse cx="34" cy="54" rx="16" ry="3.5" fill="#ca8a04" opacity="0.18" />
      <circle cx="24" cy="40" r="12" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="38" cy="34" r="12" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="32" cy="46" r="10" fill="#fcd34d" stroke="#ca8a04" strokeWidth="1.5" />
      <text x="24" y="44" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b45309">
        ¥
      </text>
      <text x="38" y="38" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b45309">
        P
      </text>
    </svg>
  );
}

export function RecGiftArt({ className = "h-14 w-14" }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <ellipse cx="30" cy="54" rx="14" ry="3.5" fill="#f472b6" opacity="0.2" />
      <rect x="14" y="28" width="32" height="20" rx="3" fill="#fda4af" stroke="#f43f5e" strokeWidth="1.5" />
      <rect x="12" y="20" width="36" height="10" rx="2" fill="#fb7185" stroke="#e11d48" strokeWidth="1.5" />
      <rect x="28" y="20" width="4" height="28" fill="#e11d48" opacity="0.75" />
      <path d="M30 20c-6-4-10-4-12-2s0 6 6 6h6V20z" fill="#fecdd3" stroke="#e11d48" strokeWidth="1" />
      <path d="M30 20c6-4 10-4 12-2s0 6-6 6H30V20z" fill="#fecdd3" stroke="#e11d48" strokeWidth="1" />
    </svg>
  );
}
