import { NextResponse } from "next/server";

// Server-side proxy for defence news (Indian defence only).
// - Page size: 5 articles per request (initial 5, then 5 per View More).
// - Upstream newsdata.io responses are cached server-side for 1 hour,
//   so the free-tier quota is shared across all visitors.
// - Clients fetch the next batch via ?page=<nextPageToken>.
//   No nextPage => feed exhausted => widget shows "You have reached the end."
const NEWS_API_KEY =
  process.env.NEWS_API_KEY || "pub_70bcd166e5de4542b7f99c0d2f641ad6";

const PAGE_SIZE = 5;

export const revalidate = 3600;

function isArticle(a: unknown): a is Record<string, unknown> {
  return (
    !!a &&
    typeof a === "object" &&
    typeof (a as Record<string, unknown>).title === "string" &&
    typeof (a as Record<string, unknown>).link === "string"
  );
}

export async function GET(req: Request) {
  const page = new URL(req.url).searchParams.get("page") ?? "";

  const upstream =
    "https://newsdata.io/api/1/latest" +
    `?apikey=${NEWS_API_KEY}` +
    "&q=Indian+Defence+OR+Indian+Army+OR+Indian+Air+Force+OR+Indian+Navy" +
    "&country=in&language=en&image=1&removeduplicate=1" +
    (page ? `&page=${encodeURIComponent(page)}` : "");

  try {
    const res = await fetch(upstream, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, results: [], nextPage: null },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        }
      );
    }

    const data: unknown = await res.json();
    const payload =
      data && typeof data === "object"
        ? (data as { results?: unknown; nextPage?: unknown })
        : null;
    const raw = payload?.results;
    const results = Array.isArray(raw) ? raw.filter(isArticle) : [];
    const token = payload?.nextPage;

    return NextResponse.json(
      {
        success: true,
        results: results.slice(0, PAGE_SIZE),
        nextPage: typeof token === "string" ? token : null,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    );
  } catch {
    return NextResponse.json({ success: false, results: [], nextPage: null });
  }
}
