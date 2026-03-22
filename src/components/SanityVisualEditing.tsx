"use client";

import { VisualEditing } from "next-sanity/visual-editing";
import { useRouter } from "next/navigation";

/**
 * Wraps VisualEditing with a custom refresh handler.
 *
 * Draft mutations are handled by SanityLive (live content API with browserToken)
 * so we skip those entirely here. We only trigger a soft refresh on publish
 * events (source === "manual") to avoid the editor refreshing while typing.
 */
export default function SanityVisualEditing() {
  const router = useRouter();

  return (
    <VisualEditing
      refresh={(payload) => {
        // SanityLive handles all live draft updates via browserToken — no-op
        if (payload.source === "mutation") {
          return false;
        }

        // Manual refresh (e.g. publish action) — soft refresh the page
        router.refresh();
        return Promise.resolve();
      }}
    />
  );
}
