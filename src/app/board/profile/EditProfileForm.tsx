"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/services/profile";
import { profileEditSchema } from "@/lib/validation";
import type { Profile } from "@/types/spread";

export function EditProfileForm({
  userId,
  profile,
}: {
  userId: string;
  profile: Profile;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [socialLink, setSocialLink] = useState(profile.socialLink ?? "");
  const [availability, setAvailability] = useState(profile.availability ?? "");
  const [area, setArea] = useState(profile.area ?? "");
  const [paymentNote, setPaymentNote] = useState(profile.paymentNote ?? "");
  const [isLive, setIsLive] = useState(profile.isLive);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const result = profileEditSchema.safeParse({
      displayName: displayName.trim(),
      socialLink: socialLink.trim(),
      availability: availability.trim(),
      area: area.trim(),
      paymentNote: paymentNote.trim(),
      isLive,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    try {
      await updateProfile(supabase, userId, result.data);
      setSaved(true);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-soft">
          Display name
        </label>
        <input
          className="input-field"
          value={displayName}
          maxLength={60}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-soft">
          Order here
        </label>
        <input
          className="input-field"
          value={socialLink}
          maxLength={200}
          placeholder="https://instagram.com/yourname"
          onChange={(e) => setSocialLink(e.target.value)}
        />
        <p className="mt-1 text-xs text-soft">
          Where people go to order from you — Instagram, Messenger, a phone
          link, whatever you use.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-soft">
          Availability
        </label>
        <input
          className="input-field"
          value={availability}
          maxLength={100}
          placeholder="Thu–Sun, 5–9pm"
          onChange={(e) => setAvailability(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-soft">
          Area
        </label>
        <input
          className="input-field"
          value={area}
          maxLength={100}
          placeholder="Delivering around Sample University"
          onChange={(e) => setArea(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-soft">
          Payment note
        </label>
        <input
          className="input-field"
          value={paymentNote}
          maxLength={100}
          placeholder="I take Venmo, Cash App, or cash"
          onChange={(e) => setPaymentNote(e.target.value)}
        />
      </div>

      <div className="card p-4">
        <label className="flex items-center justify-between gap-3">
          <span>
            <span className="font-display text-sm font-bold">
              Ready to start Spreadin&rsquo;
            </span>
            <span className="mt-0.5 block text-xs text-soft">
              When on, your area, availability, and order link show on your
              spreads and people can order. When off, your spreads are
              view-only.
            </span>
          </span>
          <input
            type="checkbox"
            checked={isLive}
            onChange={(e) => setIsLive(e.target.checked)}
            className="h-6 w-11 shrink-0 accent-hot"
          />
        </label>
        {isLive && (
          <p className="mt-3 rounded-input bg-tomato-tint p-3 text-xs text-hot">
            Collect payment from the customer before you spend your own money
            at the counter. That one rule protects you from getting stiffed.
          </p>
        )}
      </div>

      {error && <p className="text-sm text-hot">{error}</p>}
      {saved && <p className="text-sm text-herb">Saved.</p>}

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
