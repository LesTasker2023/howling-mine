"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { urlFor } from "@/sanity/image";
import { SectionHeader } from "@/components/ui";
import { fadeIn, staggerContainer, fadeUp } from "@/lib/motion";
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null,
    );
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null,
    );
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  const activeItem =
    lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <>
      <motion.section
        className={styles.section}
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {heading && <SectionHeader title={heading} />}
        <motion.div
          className={`${styles.gallery} ${styles[`gallery--${layout}`]}`}
          style={
            layout === "grid"
              ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
              : undefined
          }
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {images.map((item, i) => {
            if (!item.image?.asset) return null;
            return (
              <motion.figure
                key={i}
                className={styles.figure}
                variants={fadeUp}
              >
                <button
                  type="button"
                  className={styles.imageBtn}
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`View ${item.alt} full size`}
                >
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
                </button>
                {item.caption && (
                  <figcaption className={styles.caption}>
                    {item.caption}
                  </figcaption>
                )}
              </motion.figure>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            key="lightbox"
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              type="button"
              className={styles.lbClose}
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.lbNav} ${styles.lbPrev}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  className={`${styles.lbNav} ${styles.lbNext}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              className={styles.lbImageWrap}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urlFor(activeItem.image)
                  .width(1920)
                  .auto("format")
                  .quality(90)
                  .url()}
                alt={activeItem.alt}
                width={1920}
                height={1080}
                className={styles.lbImage}
                priority
              />
              {activeItem.caption && (
                <p className={styles.lbCaption}>{activeItem.caption}</p>
              )}
              <span className={styles.lbCounter}>
                {lightboxIndex! + 1} / {images.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
