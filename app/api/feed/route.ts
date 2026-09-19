import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  clampLimit,
  decodeCursor,
  FEED_DEFAULT_LIMIT,
  getCommunityFeed,
} from "@/lib/feed/community-feed";

// GET /api/feed?cursor={opaque_cursor}&limit=10
//
// - Community posts are public; no private/draft posts exist in the schema,
//   so there is nothing extra to hide. Identity is resolved server-side from
//   the first-party visitorId cookie (used only for likedByMe/commentedByMe).
// - Response is personalized per viewer -> never cached (no-store).
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const limit = clampLimit(params.get("limit") ?? String(FEED_DEFAULT_LIMIT));
  const cursor = decodeCursor(params.get("cursor"));

  if (params.get("cursor") && !cursor) {
    return NextResponse.json(
      { success: false, message: "Invalid cursor." },
      { status: 400 }
    );
  }

  try {
    // Strict server-side identity: client-supplied user ids are never trusted.
    const cookieStore = await cookies();
    const visitorId = cookieStore.get("visitorId")?.value ?? null;
    let customerId: string | null = null;
    if (visitorId) {
      const customer = await db.customer.findUnique({
        where: { visitorId },
        select: { id: true },
      });
      customerId = customer?.id ?? null;
    }

    const feed = await getCommunityFeed({ customerId, cursor, limit });

    return NextResponse.json(
      { success: true, ...feed },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error serving community feed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load feed.", posts: [], nextCursor: null, hasMore: false },
      { status: 500 }
    );
  }
}
