import { Tile } from "@/components/Tile";
import { Node } from "@/components/Node";

export function ShareMockup() {
  return (
    <div className="card mt-6 overflow-hidden p-0">
      <div className="border-b border-line bg-bg px-4 py-2 text-center text-xs font-semibold text-soft">
        What your audience sees
      </div>
      <div className="p-5">
        <div className="rounded-input border border-line2 bg-gradient-to-br from-[#FFF1E8] to-[#FFEBE5] p-4">
          <p className="font-display text-xs font-bold text-hot">Spread +</p>
          <p className="mt-2 font-display text-lg font-extrabold">
            The Orange Chicken Drop
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-soft">
            <Tile letter="P" color="amber" size="sm" />
            <Node size="sm" />
            <Tile letter="M" color="herb" size="sm" />
          </div>
          <p className="mt-2 text-xs text-soft">
            A meal The Orange Chicken Drop swears by.
          </p>
        </div>

        <div className="mt-4 rounded-input bg-bg p-3 text-sm text-soft">
          &ldquo;I made my own menu. Two local spots, one meal, delivered by
          me. Check out what I&rsquo;m offering and message me to request
          yours: spread.app/@you&rdquo;
        </div>
      </div>
    </div>
  );
}
