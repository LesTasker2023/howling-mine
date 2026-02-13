"use client";

import { useCallback, useState } from "react";
import { type StringInputProps, useClient, useFormValue } from "sanity";
import { Button, Card, Flex, Stack, Text, TextInput } from "@sanity/ui";

/**
 * Custom Sanity input that accepts pasted EU coordinates
 * in the format: [Space, 78061, 79412, -702, Waypoint]
 * and auto-fills the euX, euY, euZ fields on the document.
 */
export function CoordsPasteInput(props: StringInputProps) {
  const [paste, setPaste] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const client = useClient({ apiVersion: "2024-01-01" });
  const documentId = useFormValue(["_id"]) as string | undefined;

  const handleParse = useCallback(async () => {
    setError(null);
    setSuccess(null);

    // Parse formats:
    //   [Space, 78061, 79412, -702, Waypoint]
    //   Space, 78061, 79412, -702, Waypoint
    //   78061, 79412, -702
    const coordPattern =
      /\[?\s*(?:\w+\s*,\s*)?(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)(?:\s*,\s*\w+)?\s*\]?/;
    const match = paste.trim().match(coordPattern);

    if (!match) {
      setError(
        "Could not parse. Expected: [Space, 78061, 79412, -702, Waypoint]",
      );
      return;
    }

    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    const z = parseInt(match[3], 10);

    if (!documentId) {
      setError("Save the document first, then paste coordinates.");
      return;
    }

    // Sanity stores drafts with a 'drafts.' prefix
    const id = documentId.startsWith("drafts.")
      ? documentId
      : `drafts.${documentId}`;

    setLoading(true);
    try {
      await client.patch(id).set({ euX: x, euY: y, euZ: z }).commit();
      setSuccess(`Applied — X: ${x}   Y: ${y}   Z: ${z}`);
      setPaste("");
    } catch {
      setError("Failed to apply coordinates. Try saving the document first.");
    } finally {
      setLoading(false);
    }
  }, [paste, client, documentId]);

  return (
    <Stack space={3}>
      <Text size={1} muted>
        Paste in-game coords, e.g.{" "}
        <code>[Space, 78061, 79412, -702, Waypoint]</code>
      </Text>
      <Flex gap={2} align="center">
        <div style={{ flex: 1 }}>
          <TextInput
            placeholder="[Space, 78061, 79412, -702, Waypoint]"
            value={paste}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPaste(e.currentTarget.value);
              setError(null);
              setSuccess(null);
            }}
          />
        </div>
        <Button
          text="Apply"
          tone="primary"
          onClick={handleParse}
          disabled={!paste.trim() || loading}
        />
      </Flex>
      {error && (
        <Card tone="critical" padding={2} radius={2}>
          <Text size={1}>{error}</Text>
        </Card>
      )}
      {success && (
        <Card tone="positive" padding={2} radius={2}>
          <Text size={1}>{success}</Text>
        </Card>
      )}
    </Stack>
  );
}
