// An original, flat-illustration composition showing a creator walking a
// favorite order up to a neighbor's door — the dominant hero visual,
// replacing a stock food photo so the creator opportunity reads first,
// not the food itself. Same brand palette and stroke conventions as
// DeliveryScene, reusing the real LogoMark on the bag for continuity.
import { LogoMark } from "./Logo";

export function HeroScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <rect width="400" height="260" fill="#E8E5DA" />

      {/* background: a tree and a couple of houses, far side of the street */}
      <rect x="38" y="148" width="4" height="48" fill="#26231F" opacity="0.45" />
      <circle cx="40" cy="136" r="27" fill="#42634B" opacity="0.85" />

      <g opacity="0.85">
        <path d="M300 118 L330 90 L360 118 Z" fill="#C4472D" />
        <rect
          x="306"
          y="118"
          width="48"
          height="54"
          fill="#FFF7ED"
          stroke="#26231F"
          strokeWidth="1.4"
        />
        <rect x="324" y="142" width="14" height="30" fill="#26231F" opacity="0.65" />
      </g>
      {/* sidewalk */}
      <rect x="0" y="202" width="400" height="58" fill="#F3E7DA" />
      <line
        x1="0"
        y1="202"
        x2="400"
        y2="202"
        stroke="#26231F"
        strokeWidth="1.2"
        opacity="0.12"
      />

      {/* the house the creator is walking up to, door built into its wall */}
      <path d="M352 112 L376 90 L400 112 Z" fill="#42634B" />
      <rect
        x="352"
        y="112"
        width="48"
        height="148"
        fill="#FFF7ED"
        stroke="#26231F"
        strokeWidth="1.4"
      />
      <rect
        x="372"
        y="172"
        width="20"
        height="88"
        rx="2"
        fill="#42634B"
        stroke="#26231F"
        strokeWidth="1.6"
      />
      <circle cx="388" cy="218" r="2.4" fill="#C4472D" />

      {/* the creator, mid-delivery */}
      <g>
        <ellipse cx="182" cy="248" rx="34" ry="6" fill="#26231F" opacity="0.1" />
        <rect x="162" y="208" width="14" height="38" rx="6" fill="#26231F" />
        <rect x="188" y="208" width="14" height="38" rx="6" fill="#26231F" />
        <rect x="150" y="162" width="14" height="42" rx="7" fill="#C4472D" />
        <rect x="156" y="154" width="58" height="62" rx="18" fill="#C4472D" />
        <circle
          cx="185"
          cy="132"
          r="22"
          fill="#FFF7ED"
          stroke="#26231F"
          strokeWidth="1.8"
        />
        <path
          d="M163 130 A22 22 0 0 1 207 130"
          stroke="#26231F"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M206 170 Q234 170 234 190"
          stroke="#C4472D"
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* the insulated bag, carrying the real mark, handed toward the door */}
      <g transform="translate(222, 184)">
        <path
          d="M6 0 Q6 -8 14 -8 L26 -8 Q34 -8 34 0"
          stroke="#26231F"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <rect
          x="2"
          y="0"
          width="36"
          height="26"
          rx="6"
          fill="#C4472D"
          stroke="#26231F"
          strokeWidth="1.6"
        />
        <g transform="translate(11, 3)">
          <LogoMark size={18} />
        </g>
      </g>
    </svg>
  );
}
