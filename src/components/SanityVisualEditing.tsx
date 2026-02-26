"use client";

import { VisualEditing } from "next-sanity/visual-editing";
import { useRouter } from "next/navigation";

/**
 * Wraps VisualEditing with a custom refresh handler.
 *
 * Default behaviour calls `revalidatePath('/', 'layout')` when the Presentation
 * tool sends a mutation with `livePreviewEnabled: false` (happens intermittently
 * due to comlink timing). That hard-refreshes the entire page.
 *
 * Because we run `<SanityLive />` with a `browserToken`, draft mutations are
 * already picked up via the Live Content API → `revalidateSyncTags` →
 * `router.refresh()`. So here we just do a soft refresh in *all* cases that
 * weren't already handled by SanityLive.
 */
export default function SanityVisualEditing() {
  const router = useRouter();

  return (
    <VisualEditing
      refresh={(payload) => {
        // When livePreviewEnabled is true for mutations, SanityLive handles it.
        if (payload.source === "mutation" && payload.livePreviewEnabled) {
          return false; // no-op — SanityLive will trigger router.refresh()
        }

        // Everything else: soft refresh instead of revalidatePath('/', 'layout')
        router.refresh();
        return Promise.resolve();
      }}
    />
  );
}
