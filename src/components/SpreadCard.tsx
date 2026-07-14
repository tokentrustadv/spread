import Link from "next/link";
import { Tile } from "./Tile";
import { Node } from "./Node";
import type { Spread } from "@/types/spread";

export function SpreadCard({
  spread,
  handle,
}: {
  spread: Spread;
  handle: string;
}) {
  const [a, b] = spread.restaurants;

  return (
    <Link href={`/@${handle}/${spread.slug}`} className="card block p-4">
      <div className="flex items-center gap-4">
        <Tile letter={spread.title} color={spread.color} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold">{spread.title}</h3>
          {a && b && (
            <div className="mt-1 flex items-center gap-2 text-sm text-soft">
              <span className="truncate">{a.name}</span>
              <Node size="sm" />
              <span className="truncate">{b.name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
