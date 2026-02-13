"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { SectionHeader } from "@/components/ui";
import styles from "./ImageGallerySection.module.css";

interface GalleryImage {
  image: { asset: { _ref: string } };
  alt: string;
  caption?: string;
}

interface ImageGallerySectionProps {
  heading?: string;
  images: GalleryImage[];
  layout?: "grid" | "masonry" | "single";
  columns?: number;
}

export function ImageGallerySection({
  heading,
  images,
  layout = "grid",
  columns = 3,
}: ImageGallerySectionProps) {
  return (
    <section className={styles.section}>
      {heading && <SectionHeader title={heading} />}
      <div
        className={`${styles.gallery} ${styles[`gallery--${layout}`]}`}
        style={
          layout === "grid"
            ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
            : undefined
        }
      >
        {images.map((item, i) => {
          if (!item.image?.asset) return null;
          return (
            <figure key={i} className={styles.figure}>
              <div className={styles.imageWrap}>
                <Image
                  src={urlFor(item.image).width(800).auto("format").url()}
                  alt={item.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk3KFb5gAAAABJRU5ErkJggg=="
                  className={styles.image}
                />
              </div>
              {item.caption && (
                <figcaption className={styles.caption}>
                  {item.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
