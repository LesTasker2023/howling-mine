"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import styles from "./SearchInput.module.css";

export type SearchSize = "sm" | "md" | "lg";

export interface SearchInputProps {
  /** Controlled input value */
  value?: string;
  /** Called with debounced value on change */
  onChange?: (value: string) => void;
  /** Placeholder text (default: "Search...") */
  placeholder?: string;
  /** Input size (default: "md") */
  size?: SearchSize;
  /** Debounce delay in ms (default: 250) */
  debounce?: number;
  /** Auto-focus on mount (default: false) */
  autoFocus?: boolean;
  /** Optional className */
  className?: string;
}

export function SearchInput({
  value: controlledValue,
  onChange,
  placeholder = "Search...",
  size = "md",
  debounce = 250,
  autoFocus = false,
  className = "",
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync controlled value
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInternalValue(val);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange?.(val);
      }, debounce);
    },
    [onChange, debounce],
  );

  const handleClear = useCallback(() => {
    setInternalValue("");
    onChange?.("");
    inputRef.current?.focus();
  }, [onChange]);

  const classes = [
    styles.wrapper,
    size !== "md" && styles[`wrapper--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <Search className={styles.icon} />
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        spellCheck={false}
      />
      {internalValue && (
        <button
          type="button"
          className={styles.clear}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
