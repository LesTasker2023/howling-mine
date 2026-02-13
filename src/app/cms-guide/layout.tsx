import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS Guide — The Howling Mine",
  description:
    "A walkthrough of everything configurable through the Sanity CMS.",
};

export default function CmsGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
