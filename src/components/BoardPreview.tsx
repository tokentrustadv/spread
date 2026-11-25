import { Tile } from "./Tile";
import { AvatarTile } from "./AvatarTile";
import type { SpreadStyle } from "@/lib/spreadStyle";

// A static, polished mockup of a real board page — not a live screenshot,
// but built from the same Tile/card language as the actual product, so it
// reads as a believable preview rather than an abstract illustration.
export function BoardPreview({
  handle,
  displayName,
  initial,
  style,
  title,
  restaurant,
  item,
  price,
  area,
  hours,
  sampleRequest,
  className,
}: {
  handle: string;
  displayName: string;
  initial: string;
  style: SpreadStyle;
  title: string;
  restaurant: string;
  item: string;
  price: number;
  area: string;
  hours: string;
  sampleRequest?: { customerName: string; contactLabel: string };
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
          <AvatarTile letter={initial} />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold">
              {displayName}
            </p>
            <p className="truncate text-xs text-soft">@{handle}</p>
          </div>
        </div>

        <div className="mt-4 rounded-input border border-line2 p-3">
          <div className="flex items-start justify-between gap-2">
            <Tile style={style} size="sm" />
            <div className="min-w-0 flex-1">
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

        {sampleRequest && (
          <div className="mt-4 rounded-input border border-line2 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-soft">
                Example request
              </p>
              <span className="shrink-0 rounded-full bg-tomato-tint px-2 py-0.5 text-[10px] font-semibold text-hot">
                New
              </span>
            </div>
            <p className="mt-1.5 text-sm font-semibold">
              {sampleRequest.customerName}
            </p>
            <p className="text-xs text-soft">{sampleRequest.contactLabel}</p>
            <div className="mt-2.5 flex gap-2">
              <span className="flex-1 rounded-input bg-hot px-3 py-1.5 text-center text-xs font-semibold text-bg">
                Accept
              </span>
              <span className="flex-1 rounded-input border border-line2 px-3 py-1.5 text-center text-xs font-semibold text-soft">
                Decline
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
