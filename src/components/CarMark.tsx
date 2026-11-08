// A small cartoon delivery car, carrying the Spread "S" as a door emblem
// — the second half of the "this is personal delivery" pairing alongside
// the bike/wheel mark (DeliveryMark, Logo's LogoMark): sometimes it's a
// bike, sometimes it's a car, always a person, never a gig-app courier.
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
      height={size * 0.6}
      viewBox="0 0 200 120"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M18 88 L18 62 Q18 50 30 48 L52 45 Q64 24 88 24 L128 24 Q146 24 154 40 L172 46 Q186 48 186 62 L186 80 Q186 88 178 88 Z"
        fill="#6A635A"
        stroke="#26231F"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M64 45 Q74 30 90 30 L124 30 Q138 30 146 42 L148 45 Z"
        fill="#FFF7ED"
        opacity="0.85"
      />
      <circle cx="56" cy="88" r="17" fill="#26231F" />
      <circle cx="56" cy="88" r="7" fill="#D8CDBF" />
      <circle cx="150" cy="88" r="17" fill="#26231F" />
      <circle cx="150" cy="88" r="7" fill="#D8CDBF" />
      <circle cx="104" cy="62" r="13" fill="#C4472D" stroke="#FFF7ED" strokeWidth="2.5" />
      <svg x="95" y="53" width="18" height="18" viewBox="0 0 100 100">
        <path
          d="M71 26C64 16 48 13 36 19C24 25 20 38 29 45C38 52 55 48 64 55C73 62 69 75 57 81C45 87 29 84 22 74"
          stroke="white"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </svg>
  );
}
