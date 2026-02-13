"use client";

import { useCallback } from "react";
import { Flex, Text } from "@sanity/ui";
import { set, type NumberInputProps } from "sanity";

/**
 * Custom Sanity input — renders a native range slider with a percentage readout.
 * Designed for 0-100 values (opacity, darkness, etc.).
 */
export function SliderInput(props: NumberInputProps) {
  const { value, onChange } = props;
  const current = value ?? 65;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(set(Number(e.target.value)));
    },
    [onChange],
  );

  return (
    <Flex align="center" gap={3}>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={current}
        onChange={handleChange}
        style={{
          flex: 1,
          accentColor: "#eab308",
          cursor: "pointer",
        }}
      />
      <Text size={2} weight="bold" style={{ minWidth: 42, textAlign: "right" }}>
        {current}%
      </Text>
    </Flex>
  );
}
