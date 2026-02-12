/**
 * Studio layout — just passes children through.
 * NavShell detects /studio and hides its chrome.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
