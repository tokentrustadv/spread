// A cohesive, dimensional illustration for the "You control the flow"
// band — a storefront (pickup), the car, an insulated delivery bag
// carrying the real Spread mark as its tag, and a customer's doorstep
// (drop-off), connected by a dashed route line. Filled shapes in the
// brand's cream / charcoal / terracotta / muted-sage palette, replacing
// the earlier thin-line-only scene and stick figure.
import { CarGlyph } from "./CarMark";
import { LogoMark } from "./Logo";

export function DeliveryScene({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 340 136"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* dashed ground route */}
      <line
        x1="10"
        y1="116"
        x2="330"
        y2="116"
        stroke="#C4472D"
        strokeWidth="2"
        strokeDasharray="1 8"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* storefront (pickup) */}
      <ellipse cx="55" cy="118" rx="38" ry="4" fill="#26231F" opacity="0.08" />
      <path
        d="M20 70 L55 42 L90 70 Z"
        fill="#C4472D"
        stroke="#26231F"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect
        x="26"
        y="70"
        width="58"
        height="46"
        rx="3"
        fill="#FFF7ED"
        stroke="#26231F"
        strokeWidth="1.6"
      />
      <rect x="47" y="92" width="16" height="24" rx="2" fill="#26231F" />
      <rect
        x="32"
        y="78"
        width="12"
        height="12"
        rx="1.5"
        fill="#E8E5DA"
        stroke="#26231F"
        strokeWidth="1.2"
      />
      <rect
        x="66"
        y="78"
        width="12"
        height="12"
        rx="1.5"
        fill="#E8E5DA"
        stroke="#26231F"
        strokeWidth="1.2"
      />

      {/* car, parked beside the storefront */}
      <ellipse cx="151" cy="118" rx="34" ry="4" fill="#26231F" opacity="0.08" />
      <g transform="translate(112, 84)">
        <CarGlyph />
      </g>

      {/* insulated delivery bag, carrying the real Spread mark */}
      <ellipse cx="246" cy="118" rx="20" ry="4" fill="#26231F" opacity="0.08" />
      <path
        d="M233 92 Q233 84 241 84 L253 84 Q261 84 261 92"
        stroke="#26231F"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x="229"
        y="92"
        width="36"
        height="26"
        rx="6"
        fill="#C4472D"
        stroke="#26231F"
        strokeWidth="1.6"
      />
      <line
        x1="229"
        y1="101"
        x2="265"
        y2="101"
        stroke="#26231F"
        strokeWidth="1.2"
        opacity="0.45"
      />
      <g transform="translate(238, 94)">
        <LogoMark size={18} />
      </g>

      {/* customer's doorstep (drop-off) */}
      <path
        d="M286 116 L286 86 Q286 74 298 74 L310 74 Q322 74 322 86 L322 116"
        fill="#42634B"
        opacity="0.18"
        stroke="#26231F"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <rect
        x="280"
        y="116"
        width="48"
        height="7"
        rx="1.5"
        fill="#E8E5DA"
        stroke="#26231F"
        strokeWidth="1.2"
      />
      <circle cx="314" cy="96" r="1.8" fill="#26231F" />
    </svg>
  );
}
