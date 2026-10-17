export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 100" className={className} fill="none" aria-hidden="true">
      <path
        d="M16 84V36a28 28 0 0 1 56 0v48"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M32 46a12 12 0 0 1 24 0"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M21 50h4a12 8 0 0 1 0 16h-4Zm2.8 3h1.6a8.8 5 0 0 1 0 10h-1.6Z"
      />
      <g fill="currentColor">
        <rect x="51" y="50" width="16" height="3.2" rx="1.4" />
        <rect x="51" y="50" width="3.2" height="9.6" rx="1.4" />
        <rect x="51" y="56.4" width="16" height="3.2" rx="1.4" />
        <rect x="63.8" y="56.4" width="3.2" height="9.6" rx="1.4" />
        <rect x="51" y="62.8" width="16" height="3.2" rx="1.4" />
      </g>
      <g fill="currentColor">
        <rect x="22" y="70" width="12" height="4" rx="2" />
        <rect x="54" y="70" width="12" height="4" rx="2" />
        <rect x="22" y="80" width="10" height="4" rx="2" />
        <rect x="56" y="80" width="10" height="4" rx="2" />
      </g>
      <circle cx="44" cy="74" r="4.6" fill="currentColor" />
      <path d="M40.2 76.2h7.6L44 85.2Z" fill="currentColor" />
      <path
        d="M16 84c8 11 48 11 56 0"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
