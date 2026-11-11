import { Tile } from "./Tile";
import type { SpreadColor } from "@/lib/colors";

// A static, polished mockup of a real board page — not a live screenshot,
// but built from the same Tile/card language as the actual product, so it
// reads as a believable preview rather than an abstract illustration.
export function BoardPreview({
  handle,
  displayName,
  initial,
  color,
  title,
  restaurant,
  item,
  price,
  area,
  hours,
  className,
}: {
  handle: string;
  displayName: string;
  initial: string;
  color: SpreadColor;
  title: string;
  restaurant: string;
  item: string;
  price: number;
  area: string;
  hours: string;
  className?: string;
}) {
  return (
    <div className={`card overflow-hidden ${className ?? ""}`}>
      <div className="flex items-center gap-1.5 bg-bg px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line2" />
        <span className="h-2.5 w-2.5 rounded-full bg-line2" />
        <span className="h-2.5 w-2.5 rounded-full bg-line2" />
        <span className="ml-2 truncate text-xs text-soft">
          spread&rsquo;s @{handle}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3">
          <Tile letter={initial} color={color} />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold">
              {displayName}
            </p>
            <p className="truncate text-xs text-soft">@{handle}</p>
          </div>
        </div>

        <div className="mt-4 rounded-input border border-line2 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold">
                {title}
              </p>
              <p className="truncate text-xs text-soft">
                {restaurant} &middot; {item}
              </p>
            </div>
            <p className="shrink-0 font-display text-lg font-extrabold text-hot">
              ${price.toFixed(0)}
            </p>
          </div>
          <p className="mt-2 text-xs font-semibold text-herb">
            Accepting requests
          </p>
          <p className="text-xs text-soft">
            {area} &middot; {hours}
          </p>
        </div>
      </div>
    </div>
  );
}
