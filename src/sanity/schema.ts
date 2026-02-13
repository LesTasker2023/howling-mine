import { type SchemaTypeDefinition } from "sanity";

import { postType } from "./documents/post";
import { pageType } from "./documents/page";
import { guideType } from "./documents/guide";
import { authorType } from "./documents/author";
import { categoryType } from "./documents/category";
import { siteSettingsType } from "./documents/siteSettings";
import { mapPoiType } from "./documents/mapPoi";

// Portable Text block types
import { richTextType } from "./objects/richText";
import { codeBlockType } from "./objects/codeBlock";
import { calloutType } from "./objects/callout";
import { imageWithAltType } from "./objects/imageWithAlt";

// Page Builder section types
import {
  heroSectionType,
  pageHeroSectionType,
  statsRowSectionType,
  featureGridSectionType,
  ctaSectionType,
  richTextSectionType,
  imageGallerySectionType,
} from "./objects/sections";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    postType,
    pageType,
    guideType,
    authorType,
    categoryType,
    siteSettingsType,
    mapPoiType,
    // Objects (reusable block types)
    richTextType,
    codeBlockType,
    calloutType,
    imageWithAltType,
    // Page Builder sections
    heroSectionType,
    pageHeroSectionType,
    statsRowSectionType,
    featureGridSectionType,
    ctaSectionType,
    richTextSectionType,
    imageGallerySectionType,
  ],
};
