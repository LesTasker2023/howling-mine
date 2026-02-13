import { SectionHeader } from "@/components/ui";
import { PortableTextBody } from "@/components/ui/PortableTextBody/PortableTextBody";
import styles from "./RichTextSection.module.css";

interface RichTextSectionProps {
  heading?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  richBody: any;
  maxWidth?: "narrow" | "medium" | "full";
}

export function RichTextSection({
  heading,
  richBody,
  maxWidth = "narrow",
}: RichTextSectionProps) {
  return (
    <section className={`${styles.section} ${styles[`section--${maxWidth}`]}`}>
      {heading && <SectionHeader title={heading} />}
      <div className={styles.body}>
        <PortableTextBody value={richBody} />
      </div>
    </section>
  );
}
