"use client";

import { createElement, useMemo } from "react";
import { type PreviewProps } from "sanity";
import { Flex, Box, Text, Stack } from "@sanity/ui";
import { dynamicIcon } from "@/lib/dynamicIcon";

/**
 * Preview component for navLink items in the Site Settings navigation array.
 * Renders the chosen Lucide icon to the left of the label + href.
 */
export function NavLinkPreview(props: PreviewProps & { icon?: string }) {
  const { title, subtitle, icon: iconName } = props;
  const iconElement = useMemo(
    () =>
      iconName ? createElement(dynamicIcon(iconName), { size: 18 }) : null,
    [iconName],
  );

  return (
    <Flex align="center" gap={3} padding={2}>
      {iconElement && (
        <Box
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--card-fg-color)",
          }}
        >
          {iconElement}
        </Box>
      )}
      <Stack space={1}>
        {title && (
          <Text size={1} weight="medium">
            {title as string}
          </Text>
        )}
        {subtitle && (
          <Text size={0} muted>
            {subtitle as string}
          </Text>
        )}
      </Stack>
    </Flex>
  );
}
