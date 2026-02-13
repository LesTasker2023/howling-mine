/** Shared TypeScript types for the siteSettings singleton */

export interface NavLink {
  label: string;
  href: string;
  icon?: string; // Lucide icon name, kebab-case
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteSettings {
  siteName?: string;
  siteNameShort?: string;
  tagline?: string;
  logo?: any; // Sanity image reference
  favicon?: any;
  mainNav?: NavLink[];
  footerText?: string;
  footerLinks?: FooterLink[];
  socialLinks?: SocialLink[];
  heroOverlayOpacity?: number;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: any;
}
