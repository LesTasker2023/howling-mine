/** TypeScript types for the homepage singleton document */

export interface HomepageCta {
  label: string;
  href: string;
}

export interface HomepageStat {
  _key: string;
  value: string;
  label: string;
}

export interface HomepageEarningsItem {
  _key: string;
  label: string;
  value: string;
  usd?: string;
  highlight?: boolean;
}

export interface HomepageStep {
  _key: string;
  icon?: string;
  title: string;
  description: string;
}

export interface HomepageFaq {
  _key: string;
  question: string;
  answer: string;
}

export interface HomepageData {
  /* Hero */
  heroEnabled?: boolean;
  heroEyebrow?: string;
  heroTitle?: string;
  heroTagline?: string;
  heroDepositLine?: string;
  heroCta?: HomepageCta;
  heroSecondaryCta?: HomepageCta;
  heroTrustBadges?: string[];
  heroVideos?: { asset: { url: string } }[];
  heroCoords?: string[];

  /* Stats */
  statsEnabled?: boolean;
  stats?: HomepageStat[];

  /* Earnings */
  earningsEnabled?: boolean;
  earningsTitle?: string;
  earningsSubtitle?: string;
  earningsItems?: HomepageEarningsItem[];
  earningsNote?: string;
  earningsCta?: HomepageCta;

  /* Steps */
  stepsEnabled?: boolean;
  stepsTitle?: string;
  stepsSubtitle?: string;
  steps?: HomepageStep[];
  stepsCta?: HomepageCta;

  /* About */
  aboutEnabled?: boolean;
  aboutTitle?: string;
  aboutName?: string;
  aboutMetaTags?: string[];
  aboutImage?: { asset: { _id: string; url: string }; alt?: string };
  aboutParagraphs?: string[];

  /* FAQ */
  faqEnabled?: boolean;
  faqTitle?: string;
  faqs?: HomepageFaq[];

  /* Final CTA */
  finalCtaEnabled?: boolean;
  finalCtaTitle?: string;
  finalCtaBody?: string;
  finalCtaButton?: HomepageCta;
  finalCtaSecondaryButton?: HomepageCta;

  /* SEO */
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: any;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  signupBaseUrl?: string;
}
