// The orange-glazed chicken example, drawn going into the same insulated
// bag used throughout the illustration system — ties Jordan's example
// item directly to the delivery bag Chip responded to, rather than a
// plate sitting on its own.
import { LogoMark } from "./Logo";

export function GlazedChickenPlate({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 230"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="bagchicken-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6EFE2" />
          <stop offset="100%" stopColor="#EFE4D1" />
        </linearGradient>
      </defs>
      <rect width="400" height="230" fill="url(#bagchicken-bg)" />

      <ellipse cx="200" cy="196" rx="140" ry="14" fill="#26231F" opacity="0.08" />

      {/* the insulated bag, open at the top */}
      <g transform="translate(118, 48)">
        {/* open flap, folded back */}
        <path
          d="M10 18 Q6 -4 34 -10 L96 -10 Q124 -4 120 18"
          fill="#A83A24"
          stroke="#26231F"
          strokeWidth="1.8"
        />
        {/* bag body */}
        <rect
          x="0"
          y="18"
          width="130"
          height="118"
          rx="14"
          fill="#C4472D"
          stroke="#26231F"
          strokeWidth="2"
        />
        <rect x="0" y="18" width="130" height="30" rx="14" fill="#FFFFFF" opacity="0.1" />
        {/* dark interior, visible through the open top */}
        <path
          d="M14 18 Q65 2 116 18 L116 34 Q65 20 14 34 Z"
          fill="#3A1A10"
        />
        <g transform="translate(36, 70)">
          <LogoMark size={48} color="#FFF7ED" />
        </g>
      </g>

      {/* glazed chicken pieces, resting in the open bag */}
      <g transform="translate(150, 30)">
        <ellipse cx="46" cy="30" rx="34" ry="21" fill="#B23F28" />
        <ellipse cx="46" cy="25" rx="30" ry="16" fill="#E07E12" opacity="0.88" />
        <ellipse cx="37" cy="19" rx="9" ry="4.5" fill="#F3A33D" opacity="0.8" />

        <ellipse cx="88" cy="22" rx="28" ry="18" fill="#C4472D" />
        <ellipse cx="88" cy="17" rx="24" ry="13" fill="#DB760F" opacity="0.88" />

        {[
          [26, 14], [52, 10], [78, 8], [100, 14], [60, 24],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5" fill="#FFF7ED" opacity="0.85" />
        ))}
      </g>
    </svg>
  );
}
