import {
  PortableText,
  type PortableTextReactComponents,
} from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { HoloAccordion } from "@/components/ui/HoloAccordion";
import styles from "./PortableTextBody.module.css";

function toEmbedUrl(url?: string): string | null {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
  );
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children, value }) => <h2 id={value._key} className={styles.h2}>{children}</h2>,
    h3: ({ children, value }) => <h3 id={value._key} className={styles.h3}>{children}</h3>,
    h4: ({ children, value }) => <h4 id={value._key} className={styles.h4}>{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className={styles.blockquote}>{children}</blockquote>
    ),
    normal: ({ children }) => <p className={styles.p}>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className={styles.ul}>{children}</ul>,
    number: ({ children }) => <ol className={styles.ol}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className={styles.li}>{children}</li>,
    number: ({ children }) => <li className={styles.li}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className={styles.inlineCode}>{children}</code>
    ),
    "strike-through": ({ children }) => <s>{children}</s>,
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const blank = value?.blank;
      return (
        <a
          href={href}
          className={styles.link}
          {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    imageWithAlt: ({ value }: { value: any }) => {
      if (!value?.asset) return null;
      return (
        <figure className={styles.figure}>
          <Image
            src={urlFor(value).width(1200).auto("format").url()}
            alt={value.alt ?? ""}
            width={1200}
            height={675}
            className={styles.image}
          />
          {value.caption && (
            <figcaption className={styles.caption}>{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }: { value: any }) => (
      <div className={styles.codeWrapper}>
        {value.filename && (
          <div className={styles.codeFilename}>{value.filename}</div>
        )}
        <pre className={styles.pre} data-language={value.language}>
          <code>{value.code}</code>
        </pre>
      </div>
    ),
    callout: ({ value }: { value: any }) => (
      <aside className={styles.callout} data-tone={value.tone}>
        {Array.isArray(value.body) ? (
          <PortableText value={value.body} />
        ) : (
          <p>{value.body}</p>
        )}
      </aside>
    ),
    videoEmbed: ({ value }: { value: any }) => {
      const embedUrl = toEmbedUrl(value.url);
      if (!embedUrl) return null;
      return (
        <figure className={styles.videoFigure}>
          <div className={styles.videoWrapper}>
            <iframe
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.videoIframe}
              title={value.caption || "Embedded video"}
            />
          </div>
          {value.caption && (
            <figcaption className={styles.caption}>{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    objectShowcase: ({ value }: { value: any }) => {
      const items = value.items ?? [];
      if (items.length === 0) return null;
      return (
        <div className={styles.showcase}>
          {value.title && (
            <h3 className={styles.showcaseTitle}>{value.title}</h3>
          )}
          <div
            className={styles.showcaseGrid}
            data-count={Math.min(items.length, 4)}
          >
            {items.map((item: any, i: number) => (
              <figure key={item._key ?? i} className={styles.showcaseItem}>
                {item.image?.asset && (
                  <Image
                    src={urlFor(item.image).width(400).height(400).auto("format").url()}
                    alt={item.label}
                    width={400}
                    height={400}
                    className={styles.showcaseImage}
                  />
                )}
                <figcaption className={styles.showcaseCaption}>
                  <span className={styles.showcaseLabel}>{item.label}</span>
                  {item.description && (
                    <span className={styles.showcaseDesc}>{item.description}</span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      );
    },
    holoAccordion: ({ value }: { value: any }) => {
      const panels = value.panels ?? [];
      if (panels.length === 0) return null;
      return <HoloAccordion panels={panels} />;
    },
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Split a Portable Text array into sections at H2 boundaries.
 * Content before the first H2 is returned as a section with no heading.
 */
function splitByH2(blocks: any[]): { heading: any | null; content: any[] }[] {
  const sections: { heading: any | null; content: any[] }[] = [];
  let current: { heading: any | null; content: any[] } = {
    heading: null,
    content: [],
  };

  for (const block of blocks) {
    const isH2 =
      block._type === "block" && block.style === "h2";

    if (isH2) {
      // Push the previous section if it has any content
      if (current.heading || current.content.length > 0) {
        sections.push(current);
      }
      current = { heading: block, content: [] };
    } else {
      current.content.push(block);
    }
  }

  // Push the final section
  if (current.heading || current.content.length > 0) {
    sections.push(current);
  }

  return sections;
}

interface Props {
  value: any; // Portable Text array
}

export function PortableTextBody({ value }: Props) {
  if (!value) return null;

  const sections = splitByH2(value);
  const hasAnySections = sections.some((s) => s.heading !== null);

  // No H2s at all — render flat, no wrappers
  if (!hasAnySections) {
    return (
      <div className={styles.body}>
        <PortableText value={value} components={components} />
      </div>
    );
  }

  return (
    <div className={styles.body}>
      {sections.map((section, i) => {
        // Content before the first H2 — render unwrapped
        if (!section.heading) {
          return (
            <PortableText
              key={`preamble-${i}`}
              value={section.content}
              components={components}
            />
          );
        }

        // Sectioned content — H2 heading + content inside a container
        return (
          <section
            key={section.heading._key ?? i}
            className={styles.section}
          >
            <PortableText
              value={[section.heading, ...section.content]}
              components={components}
            />
          </section>
        );
      })}
    </div>
  );
}
