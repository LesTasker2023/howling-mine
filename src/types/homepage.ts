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
  heroEyebrow?: string;
  heroTitle?: string;
  heroTagline?: string;
  heroDepositLine?: string;
  heroCta?: HomepageCta;
  heroTrustBadges?: string[];
  heroVideos?: { asset: { url: string } }[];
  heroCoords?: string[];

  /* Stats */
  stats?: HomepageStat[];

  /* Earnings */
  earningsTitle?: string;
  earningsSubtitle?: string;
  earningsItems?: HomepageEarningsItem[];
  earningsNote?: string;
  earningsCta?: HomepageCta;

  /* Steps */
  stepsTitle?: string;
  steps?: HomepageStep[];
  stepsCta?: HomepageCta;

  /* About */
  aboutTitle?: string;
  aboutName?: string;
  aboutMetaTags?: string[];
  aboutParagraphs?: string[];

  /* FAQ */
  faqTitle?: string;
  faqs?: HomepageFaq[];

  /* Final CTA */
  finalCtaTitle?: string;
  finalCtaBody?: string;
  finalCtaButton?: HomepageCta;

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
