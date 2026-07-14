"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createSpread, updateSpread } from "@/services/spreads";
import { spreadSchema } from "@/lib/validation";
import { SPREAD_COLORS, COLOR_TOKENS, type SpreadColor } from "@/lib/colors";
import { SaveAnimation } from "./SaveAnimation";
import type { Spread } from "@/types/spread";

type ItemDraft = { name: string; note: string };
type RestaurantDraft = { name: string; items: ItemDraft[] };

type FormState = {
  title: string;
  color: SpreadColor;
  notes: string;
  restaurants: [RestaurantDraft, RestaurantDraft];
};

function fromSpread(spread: Spread): FormState {
  const [a, b] = spread.restaurants;
  const toDraft = (r?: Spread["restaurants"][number]): RestaurantDraft => ({
    name: r?.name ?? "",
    items: (r?.items ?? []).map((i) => ({ name: i.name, note: i.note ?? "" })),
  });
  return {
    title: spread.title,
    color: spread.color,
    notes: spread.notes ?? "",
    restaurants: [toDraft(a), toDraft(b)],
  };
}

const emptyState: FormState = {
  title: "",
  color: "tomato",
  notes: "",
  restaurants: [
    { name: "", items: [{ name: "", note: "" }] },
    { name: "", items: [] },
  ],
};

export function SpreadForm({
  userId,
  handle,
  spread,
}: {
  userId: string;
  handle: string;
  spread?: Spread;
}) {
  const router = useRouter();
  const isEdit = Boolean(spread);
  const [form, setForm] = useState<FormState>(
    spread ? fromSpread(spread) : emptyState
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  const totalItems = form.restaurants.reduce((n, r) => n + r.items.length, 0);

  function updateRestaurant(index: 0 | 1, patch: Partial<RestaurantDraft>) {
    setForm((f) => {
      const restaurants = [...f.restaurants] as [RestaurantDraft, RestaurantDraft];
      restaurants[index] = { ...restaurants[index], ...patch };
      return { ...f, restaurants };
    });
  }

  function addItem(index: 0 | 1) {
    if (totalItems >= 3) return;
    updateRestaurant(index, {
      items: [...form.restaurants[index].items, { name: "", note: "" }],
    });
  }

  function removeItem(index: 0 | 1, itemIndex: number) {
    updateRestaurant(index, {
      items: form.restaurants[index].items.filter((_, i) => i !== itemIndex),
    });
  }

  function updateItem(index: 0 | 1, itemIndex: number, patch: Partial<ItemDraft>) {
    const items = form.restaurants[index].items.map((item, i) =>
      i === itemIndex ? { ...item, ...patch } : item
    );
    updateRestaurant(index, { items });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    const payload = {
      title: form.title.trim(),
      color: form.color,
      notes: form.notes.trim(),
      isPublic: true,
      restaurants: form.restaurants.map((r) => ({
        name: r.name.trim(),
        items: r.items
          .filter((i) => i.name.trim().length > 0)
          .map((i) => ({ name: i.name.trim(), note: i.note.trim() })),
      })),
    };

    const result = spreadSchema.safeParse(payload);
    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }

    setSaving(true);
    const supabase = createClient();
    try {
      if (isEdit && spread) {
        const updated = await updateSpread(supabase, spread.id, userId, result.data);
        router.push(`/@${handle}/${updated.slug}`);
      } else {
        const created = await createSpread(supabase, userId, result.data);
        setSavedSlug(created.slug);
        setShowAnimation(true);
      }
    } catch {
      setErrors(["Something went wrong saving your spread. Try again."]);
      setSaving(false);
    }
  }

  if (showAnimation && savedSlug) {
    return (
      <SaveAnimation
        title={form.title}
        color={form.color}
        restaurantA={form.restaurants[0].name || "?"}
        restaurantB={form.restaurants[1].name || "?"}
        onDone={() => router.push(`/@${handle}/${savedSlug}`)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-soft">
          What would you call it?
        </label>
        <input
          className="input-field font-display text-lg font-bold"
          value={form.title}
          maxLength={60}
          placeholder="My Favorite Ever"
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-soft">Color</label>
        <div className="flex gap-2">
          {SPREAD_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm((f) => ({ ...f, color: c }))}
              className="h-9 w-9 rounded-full border-2 transition-transform"
              style={{
                backgroundColor: COLOR_TOKENS[c].text,
                borderColor: form.color === c ? COLOR_TOKENS[c].text : "transparent",
                outline: form.color === c ? "2px solid white" : undefined,
                outlineOffset: form.color === c ? "-4px" : undefined,
                transform: form.color === c ? "scale(1.1)" : undefined,
              }}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      {form.restaurants.map((restaurant, index) => (
        <div key={index} className="card p-4">
          <label className="mb-1.5 block text-sm font-semibold text-soft">
            {index === 0 ? "First restaurant" : "Second restaurant"}
          </label>
          <input
            className="input-field"
            value={restaurant.name}
            maxLength={50}
            placeholder="e.g. Ray's BBQ"
            onChange={(e) =>
              updateRestaurant(index as 0 | 1, { name: e.target.value })
            }
          />

          <div className="mt-3 flex flex-col gap-3">
            {restaurant.items.map((item, itemIndex) => (
              <div key={itemIndex} className="rounded-input border border-line p-3">
                <div className="flex items-center gap-2">
                  <input
                    className="input-field"
                    value={item.name}
                    maxLength={60}
                    placeholder="e.g. Brisket sandwich"
                    onChange={(e) =>
                      updateItem(index as 0 | 1, itemIndex, { name: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index as 0 | 1, itemIndex)}
                    className="shrink-0 text-sm text-soft hover:text-hot"
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
                <input
                  className="input-field mt-2 text-sm"
                  value={item.note}
                  maxLength={120}
                  placeholder="How it comes (optional) — BBQ sauce on the side"
                  onChange={(e) =>
                    updateItem(index as 0 | 1, itemIndex, { note: e.target.value })
                  }
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addItem(index as 0 | 1)}
            disabled={totalItems >= 3}
            className="mt-3 text-sm font-semibold text-hot disabled:cursor-not-allowed disabled:text-soft"
          >
            + Add item
          </button>
        </div>
      ))}

      {errors.length > 0 && (
        <div className="rounded-input bg-tomato-tint p-3 text-sm text-hot">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? "Saving…" : isEdit ? "Save changes" : "Add to your board"}
      </button>
    </form>
  );
}
