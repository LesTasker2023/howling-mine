import {
  PortableText,
  type PortableTextReactComponents,
} from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import styles from "./PortableTextBody.module.css";

/* eslint-disable @typescript-eslint/no-explicit-any */
const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
    h4: ({ children }) => <h4 className={styles.h4}>{children}</h4>,
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
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

interface Props {
  value: any; // Portable Text array
}

export function PortableTextBody({ value }: Props) {
  if (!value) return null;
  return (
    <div className={styles.body}>
      <PortableText value={value} components={components} />
    </div>
  );
}
