import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * On-demand revalidation webhook for Sanity.
 *
 * Setup in Sanity → API → Webhooks:
 *   URL:    https://thehowlingmine.com/api/revalidate
 *   Secret: (match SANITY_REVALIDATE_SECRET env var)
 *   Trigger on: Create / Update / Delete
 *   Projection: { _type, "slug": slug.current }
 */

const secret = process.env.SANITY_REVALIDATE_SECRET;

// Map Sanity document types → public path(s) to revalidate
function pathsForDocument(
  type: string | undefined,
  slug: string | undefined,
): string[] {
  const paths: string[] = [];

  switch (type) {
    case "homepage":
      paths.push("/");
      break;

    case "post":
      paths.push("/news");
      if (slug) paths.push(`/news/${slug}`);
      break;

    case "guide":
      paths.push("/guides");
      if (slug) paths.push(`/guides/${slug}`);
      break;

    case "event":
      paths.push("/events");
      if (slug) paths.push(`/events/${slug}`);
      break;

    case "author":
    case "category":
      // Author/category edits can affect list pages
      paths.push("/news", "/guides");
      break;

    case "page":
      if (slug) paths.push(`/${slug}`);
      break;

    case "siteSettings":
    case "navigation":
      // Settings/nav affect every page — revalidate entire layout tree
      paths.push("/__layout__");
      break;

    default:
      // Unknown type — revalidate homepage as a safe fallback
      paths.push("/");
  }

  return paths;
}

export async function POST(req: NextRequest) {
  try {
    if (!secret) {
      return NextResponse.json(
        { message: "Missing SANITY_REVALIDATE_SECRET env var" },
        { status: 500 },
      );
    }

    const { isValidSignature, body } = await parseBody<{
      _type?: string;
      _id?: string;
      slug?: string;
    }>(req, secret);

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    // Skip draft mutations — only revalidate when a document is published
    if (body?._id?.startsWith("drafts.")) {
      return NextResponse.json({
        revalidated: false,
        reason: "draft mutation ignored",
        now: Date.now(),
      });
    }

    const paths = pathsForDocument(body?._type, body?.slug);

    for (const path of paths) {
      if (path === "/__layout__") {
        revalidatePath("/", "layout");
      } else {
        revalidatePath(path);
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      now: Date.now(),
    });
  } catch (err) {
    console.error("[revalidate webhook]", err);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
