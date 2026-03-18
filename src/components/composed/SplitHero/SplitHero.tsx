import Image from "next/image";
import styles from "./SplitHero.module.css";

interface SplitHeroProps {
  /** Back link then badges — stacked column above the split */
  topBar: React.ReactNode;
  /** Title + excerpt — sits at the top of the left column */
  textTop: React.ReactNode;
  /** Publish date / meta — pinned to the bottom of the left column */
  textBottom?: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

export function SplitHero({
  topBar,
  textTop,
  textBottom,
  imageSrc,
  imageAlt,
}: SplitHeroProps) {
  return (
    <div className={styles.hero}>
      <div className={styles.topBar}>{topBar}</div>
      <div className={styles.split}>
        <div className={styles.text}>
          <div className={styles.textTop}>{textTop}</div>
          {textBottom && <div className={styles.textBottom}>{textBottom}</div>}
        </div>
        <div className={styles.imageWrap}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            priority
          />
          <div className={styles.gradient} />
        </div>
      </div>
    </div>
  );
}
