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
  placeholderImage?: { asset: { _id: string; url: string }; alt?: string };
  mainNav?: NavLink[];
  footerText?: string;
  footerLinks?: FooterLink[];
  socialLinks?: SocialLink[];
  heroOverlayOpacity?: number;
  discordUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: any;
}
