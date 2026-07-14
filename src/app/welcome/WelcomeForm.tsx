"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProfile, isHandleAvailable } from "@/services/profile";
import { profileSchema } from "@/lib/validation";

export function WelcomeForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = profileSchema.safeParse({
      displayName: displayName.trim(),
      handle: handle.trim().toLowerCase(),
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    try {
      const available = await isHandleAvailable(supabase, result.data.handle);
      if (!available) {
        setError("That handle is already taken.");
        setSaving(false);
        return;
      }
      await createProfile(supabase, {
        id: userId,
        handle: result.data.handle,
        displayName: result.data.displayName,
      });
      router.push("/board");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
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
          placeholder="Chip Nguyen"
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-soft">
          Handle
        </label>
        <div className="flex items-center gap-2">
          <span className="text-soft">@</span>
          <input
            className="input-field"
            value={handle}
            maxLength={20}
            placeholder="chip"
            onChange={(e) =>
              setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
            }
          />
        </div>
        <p className="mt-1 text-xs text-soft">
          3-20 characters: lowercase letters, numbers, underscores.
        </p>
      </div>

      {error && <p className="text-sm text-hot">{error}</p>}

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}
