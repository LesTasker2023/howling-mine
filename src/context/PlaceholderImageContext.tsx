"use client";

import { createContext, useContext } from "react";

export interface PlaceholderImageData {
  asset: { _id: string; url: string };
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

const PlaceholderImageContext = createContext<PlaceholderImageData | null>(
  null,
);

export function PlaceholderImageProvider({
  image,
  children,
}: {
  image: PlaceholderImageData | null;
  children: React.ReactNode;
}) {
  return (
    <PlaceholderImageContext.Provider value={image}>
      {children}
    </PlaceholderImageContext.Provider>
  );
}

/** Returns the site-wide placeholder image from Sanity, or null. */
export function usePlaceholderImage() {
  return useContext(PlaceholderImageContext);
}
