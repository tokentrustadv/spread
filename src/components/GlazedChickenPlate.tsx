// Illustrated plate of orange-glazed chicken for the "Something of your
// own" example, replacing a stock photo that didn't visually read as
// orange-glazed. Same flat-illustration system as HeroScene, with soft
// two-tone shading for texture.
export function GlazedChickenPlate({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 230"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="plate-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6EFE2" />
          <stop offset="100%" stopColor="#EFE4D1" />
        </linearGradient>
      </defs>
      <rect width="400" height="230" fill="url(#plate-bg)" />

      {/* plate */}
      <ellipse cx="200" cy="128" rx="150" ry="72" fill="#FFFFFF" stroke="#26231F" strokeWidth="1.6" />
      <ellipse cx="200" cy="128" rx="120" ry="56" fill="#FBF3E6" stroke="#26231F" strokeWidth="1" opacity="0.6" />

      {/* glazed chicken pieces, warm orange tones */}
      <g>
        <ellipse cx="155" cy="118" rx="42" ry="26" fill="#C4472D" />
        <ellipse cx="155" cy="112" rx="38" ry="20" fill="#E07E12" opacity="0.85" />
        <ellipse cx="146" cy="106" rx="12" ry="6" fill="#F3A33D" opacity="0.8" />

        <ellipse cx="236" cy="128" rx="40" ry="25" fill="#B23F28" />
        <ellipse cx="236" cy="122" rx="36" ry="19" fill="#DB760F" opacity="0.85" />
        <ellipse cx="226" cy="116" rx="11" ry="5.5" fill="#F3A33D" opacity="0.75" />

        <ellipse cx="196" cy="148" rx="34" ry="21" fill="#C4472D" />
        <ellipse cx="196" cy="143" rx="30" ry="16" fill="#E07E12" opacity="0.85" />

        {/* sesame / herb fleck texture */}
        {[
          [138, 104], [168, 100], [148, 122], [220, 108], [250, 120],
          [230, 134], [186, 138], [210, 156], [178, 150],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="#FFF7ED" opacity="0.8" />
        ))}
        {[ [160, 130], [240, 140], [200, 160] ].map(([x, y], i) => (
          <circle key={`g${i}`} cx={x} cy={y} r="1.4" fill="#42634B" opacity="0.6" />
        ))}
      </g>

      {/* garnish */}
      <ellipse cx="300" cy="150" rx="18" ry="9" fill="#5A7A62" opacity="0.5" />
      <ellipse cx="108" cy="150" rx="14" ry="7" fill="#5A7A62" opacity="0.4" />
    </svg>
  );
}
