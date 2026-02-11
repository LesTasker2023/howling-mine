"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Tooltip content — string or JSX */
  content: React.ReactNode;
  /** Trigger element (must accept ref) */
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  /** Placement relative to trigger (default: "top") */
  placement?: TooltipPlacement;
  /** Delay before showing in ms (default: 200) */
  delay?: number;
  /** Optional className for the tooltip bubble */
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 200,
  className = "",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let x: number;
    let y: number;

    switch (placement) {
      case "top":
        x = rect.left + scrollX + rect.width / 2;
        y = rect.top + scrollY;
        break;
      case "bottom":
        x = rect.left + scrollX + rect.width / 2;
        y = rect.bottom + scrollY;
        break;
      case "left":
        x = rect.left + scrollX;
        y = rect.top + scrollY + rect.height / 2;
        break;
      case "right":
        x = rect.right + scrollX;
        y = rect.top + scrollY + rect.height / 2;
        break;
    }

    setCoords({ x, y });
  }, [placement]);

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setVisible(true);
    }, delay);
  }, [delay, updatePosition]);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Clamp tooltip to viewport after render
  useEffect(() => {
    if (!visible || !tooltipRef.current) return;
    const el = tooltipRef.current;
    const rect = el.getBoundingClientRect();
    const pad = 8;

    if (rect.right > window.innerWidth - pad) {
      el.style.transform = `translateX(${window.innerWidth - pad - rect.right}px)`;
    } else if (rect.left < pad) {
      el.style.transform = `translateX(${pad - rect.left}px)`;
    }
  }, [visible, coords]);

  const classes = [styles.tooltip, styles[`tooltip--${placement}`], className]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <span
        ref={triggerRef as React.RefObject<HTMLSpanElement>}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className={styles.trigger}
      >
        {children}
      </span>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={classes}
            role="tooltip"
            style={{
              left: coords.x,
              top: coords.y,
            }}
          >
            <div className={styles.content}>{content}</div>
          </div>,
          document.body,
        )}
    </>
  );
}
