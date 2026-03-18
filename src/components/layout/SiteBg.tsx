"use client";

interface SiteBgProps {
  type?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  videoMimeType?: string | null;
}

export function SiteBg({ type, imageUrl, videoUrl, videoMimeType }: SiteBgProps) {
  if (!type || type === "none") return null;
  if (type === "image" && !imageUrl) return null;
  if (type === "video" && !videoUrl) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {type === "video" && videoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={videoUrl} type={videoMimeType ?? "video/mp4"} />
        </video>
      )}
      {type === "image" && imageUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
        }}
      />
    </div>
  );
}
