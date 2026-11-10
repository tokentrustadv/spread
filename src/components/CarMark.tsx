// A restrained, thin-line car illustration — the second half of the
// "this is personal delivery" pairing alongside the bike/wheel mark
// (DeliveryMark, Logo's LogoMark): sometimes it's a bike, sometimes it's
// a car, always a person, never a gig-app courier. Matches the thin,
// single-tone silhouette language used by RouteIcons (currentColor,
// no fills except the faint brand accent on the door).
export function CarMark({
  size = 120,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 0.45}
      viewBox="0 0 200 90"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M14 64 L14 50 Q14 42 22 40 L46 36 Q58 20 78 20 L118 20 Q132 20 140 32 L150 40 L176 44 Q186 46 186 56 L186 64"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58 36 L70 24 Q76 20 84 20 L116 20 Q126 20 132 28 L140 36"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="14"
        y1="64"
        x2="186"
        y2="64"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="54" cy="64" r="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="146" cy="64" r="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="54" cy="64" r="4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="146" cy="64" r="4" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M96 38 C 93 34, 88 33, 85 36 C 82 39, 83 43, 87 45 C 91 47, 97 46, 100 49 C 103 52, 101 55, 97 57"
        stroke="#C4472D"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
