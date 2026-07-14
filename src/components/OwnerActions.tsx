"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { softDeleteSpread } from "@/services/spreads";

export function OwnerActions({
  spreadId,
  userId,
}: {
  spreadId: string;
  userId: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this spread? This can't be undone from the app.")) {
      return;
    }
    setDeleting(true);
    const supabase = createClient();
    try {
      await softDeleteSpread(supabase, spreadId, userId);
      router.push("/board");
      router.refresh();
    } catch {
      setDeleting(false);
      alert("Couldn't delete this spread. Try again.");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <a href={`/board/${spreadId}/edit`} className="btn-secondary flex-1">
        Edit
      </a>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="flex-1 rounded-input border border-line2 bg-surface px-5 py-3 font-display text-[15px] font-semibold text-hot transition-colors hover:bg-tomato-tint disabled:opacity-50"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
