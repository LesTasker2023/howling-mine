"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from "./Select.module.css";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  /** Display text */
  label: string;
  /** Option value */
  value: string;
  /** Prevent selection (default: false) */
  disabled?: boolean;
}

export interface SelectProps {
  /** Available options */
  options: SelectOption[];
  /** Currently selected value */
  value?: string;
  /** Called when selection changes */
  onChange?: (value: string) => void;
  /** Placeholder when no value selected (default: "Select...") */
  placeholder?: string;
  /** Dropdown size (default: "md") */
  size?: SelectSize;
  /** Label text above the trigger */
  label?: string;
  /** Optional className */
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  size = "md",
  label,
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (
        !open &&
        (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")
      ) {
        e.preventDefault();
        setOpen(true);
        setHighlighted(0);
        return;
      }

      if (!open) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlighted((prev) => {
            let next = prev + 1;
            while (next < options.length && options[next].disabled) next++;
            return next < options.length ? next : prev;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlighted((prev) => {
            let next = prev - 1;
            while (next >= 0 && options[next].disabled) next--;
            return next >= 0 ? next : prev;
          });
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (highlighted >= 0 && !options[highlighted].disabled) {
            onChange?.(options[highlighted].value);
            setOpen(false);
          }
          break;
        case "Escape":
          setOpen(false);
          break;
      }
    },
    [open, highlighted, options, onChange],
  );

  // Scroll highlighted into view
  useEffect(() => {
    if (open && listRef.current && highlighted >= 0) {
      const el = listRef.current.children[highlighted] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted, open]);

  const wrapperClasses = [
    styles.wrapper,
    size !== "md" && styles[`wrapper--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      {label && <span className={styles.label}>{label}</span>}
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? styles.value : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          className={styles.dropdown}
          role="listbox"
          aria-activedescendant={
            highlighted >= 0 ? `opt-${highlighted}` : undefined
          }
        >
          {options.map((opt, i) => (
            <li
              key={opt.value}
              id={`opt-${i}`}
              role="option"
              aria-selected={opt.value === value}
              className={[
                styles.option,
                opt.value === value && styles.optionSelected,
                opt.disabled && styles.optionDisabled,
                i === highlighted && styles.optionHighlighted,
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (opt.disabled) return;
                onChange?.(opt.value);
                setOpen(false);
              }}
              onMouseEnter={() => !opt.disabled && setHighlighted(i)}
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <Check size={14} className={styles.check} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
