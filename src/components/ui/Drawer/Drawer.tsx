"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import styles from "./Drawer.module.css";

export type DrawerWidth = "sm" | "md" | "lg";
export type DrawerSide = "left" | "right";

export interface DrawerProps {
  /** Whether the drawer is open */
  open: boolean;
  /** Called when drawer should close */
  onClose: () => void;
  /** Optional header title */
  title?: string;
  /** Drawer width (default: "md") */
  width?: DrawerWidth;
  /** Which edge to slide from (default: "right") */
  side?: DrawerSide;
  /** Drawer content */
  children: React.ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  width = "md",
  side = "right",
  children,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Trap focus when open
  useEffect(() => {
    if (open && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        data-open={open}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={styles.drawer}
        data-open={open}
        data-side={side}
        data-width={width}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Panel"}
        tabIndex={-1}
      >
        {title && (
          <div className={styles.header}>
            <span className={styles.title}>{title}</span>
            <button
              className={styles.close}
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </>
  );
}
