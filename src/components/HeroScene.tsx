// An original, editorial-style illustration showing a creator walking a
// favorite order up to a neighbor's door — the dominant hero visual, so
// the creator opportunity reads first, not the food itself. Natural
// figure proportions (head/neck/tapered torso/bent arms), a believable
// small-neighborhood setting (gradient sky, lawn, shrubs, windowed
// houses, textured sidewalk), and soft two-tone shading standing in for
// texture within a flat-illustration system. The real LogoMark appears
// clearly on the delivery bag for actual brand presence in the scene.
import { LogoMark } from "./Logo";

export function HeroScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE9DC" />
          <stop offset="100%" stopColor="#E8E5DA" />
        </linearGradient>
      </defs>

      <rect width="400" height="260" fill="url(#hero-sky)" />

      {/* background: a tree, shrubs, and the neighbor's house */}
      <rect x="37" y="150" width="4" height="46" fill="#26231F" opacity="0.4" />
      <circle cx="39" cy="140" r="21" fill="#38543F" opacity="0.9" />
      <circle cx="30" cy="132" r="17" fill="#42634B" />
      <circle cx="30" cy="126" r="3.5" fill="#5A7A62" opacity="0.7" />
      <circle cx="40" cy="140" r="3" fill="#5A7A62" opacity="0.6" />

      <ellipse cx="94" cy="197" rx="16" ry="11" fill="#4E7056" />
      <ellipse cx="112" cy="200" rx="13" ry="9" fill="#42634B" />

      <g>
        <path d="M300 118 L330 88 L360 118 Z" fill="#B23F28" />
        <rect
          x="306"
          y="118"
          width="48"
          height="54"
          fill="#FFF7ED"
          stroke="#26231F"
          strokeWidth="1.3"
        />
        <rect x="306" y="150" width="48" height="22" fill="#26231F" opacity="0.06" />
        <rect
          x="312"
          y="126"
          width="14"
          height="14"
          fill="#E4D7C3"
          stroke="#26231F"
          strokeWidth="1.1"
        />
        <line x1="319" y1="126" x2="319" y2="140" stroke="#26231F" strokeWidth="0.9" />
        <line x1="312" y1="133" x2="326" y2="133" stroke="#26231F" strokeWidth="0.9" />
      </g>
      <g opacity="0.72">
        <path d="M352 132 L376 108 L400 132 Z" fill="#374F3D" />
        <rect
          x="357"
          y="132"
          width="38"
          height="38"
          fill="#F0E7D8"
          stroke="#26231F"
          strokeWidth="1.1"
        />
      </g>

      {/* the house the creator is walking up to, door built into its wall */}
      <path d="M352 112 L376 88 L400 112 Z" fill="#374F3D" />
      <rect
        x="352"
        y="112"
        width="48"
        height="148"
        fill="#FBF3E6"
        stroke="#26231F"
        strokeWidth="1.4"
      />
      <rect x="352" y="112" width="10" height="148" fill="#26231F" opacity="0.05" />
      <rect
        x="359"
        y="124"
        width="15"
        height="14"
        fill="#DCE7DF"
        stroke="#26231F"
        strokeWidth="1"
      />
      <line x1="366.5" y1="124" x2="366.5" y2="138" stroke="#26231F" strokeWidth="0.8" />
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
      <rect x="372" y="172" width="20" height="88" rx="2" fill="#26231F" opacity="0.08" />
      <circle cx="388" cy="218" r="2.4" fill="#E4A96B" />
      <rect x="368" y="258" width="28" height="6" fill="#DDD0BC" />

      {/* sidewalk, with expansion-joint texture */}
      <rect x="0" y="202" width="400" height="58" fill="#F3E7DA" />
      <line
        x1="0"
        y1="202"
        x2="400"
        y2="202"
        stroke="#26231F"
        strokeWidth="1.2"
        opacity="0.14"
      />
      {[60, 128, 196, 264, 332].map((x) => (
        <line
          key={x}
          x1={x}
          y1="205"
          x2={x}
          y2="259"
          stroke="#26231F"
          strokeWidth="1"
          opacity="0.07"
        />
      ))}

      {/* the creator, mid-delivery */}
      <g>
        <ellipse cx="184" cy="250" rx="36" ry="6" fill="#26231F" opacity="0.1" />

        {/* back leg, trailing, slightly shaded for depth */}
        <path
          d="M172 200 L168 238 Q168 244 174 244 L182 244 Q186 244 185 238 L180 202 Z"
          fill="#1E1A16"
        />
        <ellipse cx="177" cy="245" rx="9" ry="4" fill="#26231F" />

        {/* front leg */}
        <path
          d="M190 200 L196 238 Q196 244 202 244 L210 244 Q214 244 212 238 L204 202 Z"
          fill="#26231F"
        />
        <ellipse cx="208" cy="245" rx="9" ry="4" fill="#1E1A16" />

        {/* back arm, relaxed at the side */}
        <path
          d="M158 160 Q150 172 152 196"
          stroke="#B23F28"
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
        />

        {/* tapered torso with a soft shaded side and a seam line */}
        <path
          d="M164 150 Q160 148 160 156 L160 200 Q160 212 184 212 Q208 212 208 200 L208 156 Q208 148 204 150 Q194 144 184 144 Q174 144 164 150 Z"
          fill="#C4472D"
        />
        <path
          d="M196 150 Q204 156 204 168 L204 200 Q204 209 192 211 Q202 204 202 192 L198 154 Z"
          fill="#A83A24"
          opacity="0.55"
        />
        <path
          d="M184 146 L184 210"
          stroke="#8F3420"
          strokeWidth="1.2"
          opacity="0.4"
        />

        {/* neck */}
        <rect x="178" y="134" width="12" height="12" fill="#F3DDC2" />

        {/* head, with a simple rounded hairline */}
        <circle
          cx="184"
          cy="122"
          r="17"
          fill="#F3DDC2"
          stroke="#26231F"
          strokeWidth="1.6"
        />
        <path
          d="M167 121 A17 17 0 0 1 201 121 Q201 110 184 108 Q167 110 167 121 Z"
          fill="#26231F"
        />

        {/* front arm, bent forward, handing off the bag */}
        <path
          d="M202 162 Q222 160 228 178"
          stroke="#C4472D"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="229" cy="182" r="6.5" fill="#F3DDC2" />
      </g>

      {/* the insulated bag, carrying the real mark, handed toward the door */}
      <g transform="translate(214, 172)">
        <path
          d="M8 2 Q8 -9 18 -9 L30 -9 Q40 -9 40 2"
          stroke="#26231F"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <rect
          x="2"
          y="2"
          width="44"
          height="32"
          rx="7"
          fill="#C4472D"
          stroke="#26231F"
          strokeWidth="1.8"
        />
        <rect x="2" y="2" width="44" height="10" rx="7" fill="#FFFFFF" opacity="0.12" />
        <g transform="translate(11, 6)">
          <LogoMark size={24} />
        </g>
      </g>
    </svg>
  );
}
