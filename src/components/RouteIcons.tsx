// Thin-line, generic silhouettes for the homepage's illustrative delivery
// route — deliberately plain (no restaurant branding, no specific
// architecture) per the brief: a stand-in building, not a real one.
export function StorefrontIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 10 L12 4 L20 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5" y="10" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="10" y="14" width="4" height="6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function HomeIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 11 L12 4 L20 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6" y="11" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="10" y="14" width="4" height="6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

// A discreet pair of vehicle glyphs — not a brand mark, just a small
// reminder that this is delivered by a person, on a bike or in a car.
export function VehicleGlyphs({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size * 2.2} height={size} viewBox="0 0 70 32" fill="none" aria-hidden="true" className={className}>
      <circle cx="9" cy="24" r="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="25" cy="24" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14 15 L18 7 L4 7 M14 24 L18 15 L25 24 M14 15 L14 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M38 24 L38 16 Q38 13 41 12 L48 10 Q52 9 55 12 L60 14 Q63 15 63 18 L63 22 Q63 24 61 24 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
      <circle cx="45" cy="24" r="3.4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="58" cy="24" r="3.4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

// The small traveling marker — the real brand mark in a circle badge.
// Filled solid when active (currently at this stop); faint outline
// otherwise.
export function RouteMarker({ active, size = 22 }: { active: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0.35 }}
    >
      <circle cx="50" cy="50" r="46" fill={active ? "#C4472D" : "none"} stroke="#C4472D" strokeWidth="6" />
      <svg x="20" y="20" width="60" height="60" viewBox="0 0 100 100">
        <path
          d="M50,10 A40,40 0 0,1 50,90 A22,22 0 0,1 50,46 A18,18 0 0,0 50,10 Z"
          fill={active ? "#FFF7ED" : "#C4472D"}
        />
      </svg>
    </svg>
  );
}
