"use client";

/**
 * Studio branding components — logo & loading screen.
 *
 * Used in sanity.config.ts → studio.components
 */
import { type CSSProperties } from "react";

/* ── Studio Logo (navbar + sidebar) ── */
export function StudioLogo() {
  return (
    <div style={logoWrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hm-logo.webp" alt="The Howling Mine" style={logoImg} />
    </div>
  );
}

const logoWrap: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "0 4px",
};

const logoImg: CSSProperties = {
  height: 28,
  width: "auto",
  objectFit: "contain",
};

/* ── Custom Loading Screen ── */
export function StudioLoading() {
  return (
    <div style={loadingWrap}>
      <style>{pulseKeyframes}</style>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hm-logo.webp" alt="Loading…" style={loadingLogo} />
      <div style={spinnerWrap}>
        <div style={spinner} />
      </div>
      <p style={loadingText}>Loading Studio…</p>
    </div>
  );
}

const pulseKeyframes = `
  @keyframes hmSpin {
    to { transform: rotate(360deg); }
  }
  @keyframes hmPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const loadingWrap: CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 24,
  background: "#0a0a0a",
  zIndex: 9999,
};

const loadingLogo: CSSProperties = {
  height: 64,
  width: "auto",
  objectFit: "contain",
  animation: "hmPulse 2s ease-in-out infinite",
};

const spinnerWrap: CSSProperties = {
  position: "relative",
  width: 32,
  height: 32,
};

const spinner: CSSProperties = {
  width: 32,
  height: 32,
  border: "2px solid rgba(234,179,8,0.15)",
  borderTopColor: "#eab308",
  borderRadius: "50%",
  animation: "hmSpin 0.8s linear infinite",
};

const loadingText: CSSProperties = {
  color: "#a1a1a1",
  fontSize: 13,
  fontFamily: '"Inter", sans-serif',
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  animation: "hmPulse 2s ease-in-out infinite",
};
