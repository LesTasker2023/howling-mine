import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System — The Howling Mine",
  robots: { index: false, follow: false },
};

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
