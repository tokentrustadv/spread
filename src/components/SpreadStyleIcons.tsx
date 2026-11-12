import type { ComponentType } from "react";
import type { SpreadStyle } from "@/lib/spreadStyle";

// Thin-line "stick drawing" icons for each item style — matches the
// convention in ControlIcons.tsx (24x24 viewBox, currentColor stroke).
type IconProps = { size?: number; className?: string };

export function BurgerIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M3.5 10.5C3.5 6.5 7.3 4 12 4s8.5 2.5 8.5 6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3 13c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 15.5h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4.5 15.5c0 2.3 1.6 4 3.8 4h7.4c2.2 0 3.8-1.7 3.8-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HotdogIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M3 15c0-2.2 1.2-3.3 3.3-3.3h11.4c2.1 0 3.3 1.1 3.3 3.3s-1.2 3.3-3.3 3.3H6.3C4.2 18.3 3 17.2 3 15Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M5.3 11.3C5.3 9 8 7 12 7s6.7 2 6.7 4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6.3 10c1-1.6 2-1.6 3 0s2 1.6 3 0 2-1.6 3 0 2 1.6 3 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SandwichIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 4 21 18H3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M6.5 13h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 16.3h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TacoIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M3.3 13.5c0 3.8 3.9 6.8 8.7 6.8s8.7-3 8.7-6.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3.3 13.5c0-1.3.7-2.3 1.7-2.3M20.7 13.5c0-1.3-.7-2.3-1.7-2.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4.6 11.2c2.3-3 12.5-3 14.8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.6 10.4c.9-1.7 1.8-1.7 2.7 0s1.8 1.7 2.7 0 1.8-1.7 2.7 0 1.8 1.7 2.7 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PizzaIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 3 21.5 20H2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M5 16.3c2.3-1.8 11.7-1.8 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11" cy="11" r="1.1" fill="currentColor" />
      <circle cx="14.5" cy="14" r="1.1" fill="currentColor" />
      <circle cx="9.5" cy="15" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function ChickenIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M13 6.5c-3.6 0-6.5 2.9-6.5 6.8 0 3.4 2.7 5.7 5.7 5.2 3.2-.6 5.4-3.1 5.1-6.9-.2-2.9-2.1-5.1-4.3-5.1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12.7 7.4 17.5 2.6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function FriesIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M6.5 20 5.5 8.5h13L17.5 20Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M5 8.5h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="7.8" y="3" width="2.3" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.9" y="2.3" width="2.3" height="6.2" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="3.6" width="2.3" height="4.9" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function NoodlesIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M3 11h18c0 4.5-4 8-9 8s-9-3.5-9-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M6 11c1-3 2.5-5 2-7M12 11c.6-2.6-.4-4.4-.2-7M17 11c-.3-2.6.6-4 .2-6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7 15.5l1.3 1.3M15.5 15.8l1.3 1.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BowlIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M3 11h18c0 4.5-4 8-9 8s-9-3.5-9-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="8" cy="9.3" r="1.1" fill="currentColor" />
      <circle cx="12.3" cy="8.2" r="1.1" fill="currentColor" />
      <circle cx="16" cy="9.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function DessertIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M7 20 6 12h12l-1 8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 12c.2-1.7.7-3 .6-4.5M12 12V7M15.4 12c-.2-1.7-.7-3-.6-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6.3 12c-.9-2.4.5-5 3-5.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.3 12c0-3 2.6-5.5 5.7-5.5s5.7 2.5 5.7 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="4.3" r="1" fill="currentColor" />
    </svg>
  );
}

export const SPREAD_STYLE_ICONS: Record<SpreadStyle, ComponentType<IconProps>> = {
  burger: BurgerIcon,
  hotdog: HotdogIcon,
  sandwich: SandwichIcon,
  taco: TacoIcon,
  pizza: PizzaIcon,
  chicken: ChickenIcon,
  fries: FriesIcon,
  noodles: NoodlesIcon,
  bowl: BowlIcon,
  dessert: DessertIcon,
};
