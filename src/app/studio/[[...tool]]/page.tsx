"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return (
    <>
      <NextStudio config={config} />
      <Link
        href="/"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8,
          color: "#e0e0e0",
          fontSize: 13,
          fontFamily: "var(--font-mono, monospace)",
          letterSpacing: "0.05em",
          textDecoration: "none",
          cursor: "pointer",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.75)";
          e.currentTarget.style.color = "#e0e0e0";
        }}
      >
        <LogOut size={16} />
        Exit
      </Link>
    </>
  );
}
