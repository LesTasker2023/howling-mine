import { type SchemaTypeDefinition } from "sanity";

import { postType } from "./documents/post";
import { pageType } from "./documents/page";
import { guideType } from "./documents/guide";
import { authorType } from "./documents/author";
import { categoryType } from "./documents/category";

// Portable Text block types
import { richTextType } from "./objects/richText";
import { codeBlockType } from "./objects/codeBlock";
import { calloutType } from "./objects/callout";
import { imageWithAltType } from "./objects/imageWithAlt";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    postType,
    pageType,
    guideType,
    authorType,
    categoryType,
    // Objects (reusable block types)
    richTextType,
    codeBlockType,
    calloutType,
    imageWithAltType,
  ],
};
