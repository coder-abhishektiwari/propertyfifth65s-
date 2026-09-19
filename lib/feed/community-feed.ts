// Light-weight community feed engine (no Redis, no extra tables).
//
// Scoring formula (calculated directly inside SQL):
//   Score = (Total Likes x 2) + (Total Comments x 5) - (Hours Since Created x 1.5)
//
// Design notes:
// - Like/comment counts are aggregated with COUNT(DISTINCT ...) because joining
//   both tables in one query would otherwise multiply rows.
// - Deleted posts need no explicit filter: deletes are hard deletes, so a
//   deleted row simply does not exist anymore.
// - There are no private/draft posts in the schema; every CommunityPost is public.
// - Cursor pagination uses the (score, id) keyset so each page is a cheap,
//   bounded DB query — 1000+ posts are never loaded into RAM.

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

/* ── Tunables (match the approved formula) ── */
export const LIKE_WEIGHT = 2;
export const COMMENT_WEIGHT = 5;
export const DECAY_PER_HOUR = 1.5;

export const FEED_DEFAULT_LIMIT = 10;
export const FEED_MAX_LIMIT = 20;

export type FeedCursor = { score: number; id: string };

export type FeedPost = {
  id: string;
  customerId: string;
  title: string;
  content: string;
  createdAt: Date;
  authorName: string | null;
  likeCount: number;
  commentCount: number;
  score: number;
  likedByMe: boolean;
  commentedByMe: boolean;
};

type FeedRow = {
  id: string;
  customerId: string;
  title: string;
  content: string;
  createdAt: Date;
  authorName: string | null;
  likeCount: number;
  commentCount: number;
  score: number;
  likedByMe: boolean;
  commentedByMe: boolean;
};

/* ── Opaque cursor: base64url("score:id") ── */
export function encodeCursor(c: FeedCursor): string {
  return Buffer.from(`${c.score}:${c.id}`, "utf8").toString("base64url");
}

export function decodeCursor(raw: string | null | undefined): FeedCursor | null {
  if (!raw) return null;
  try {
    const text = Buffer.from(raw, "base64url").toString("utf8");
    const sep = text.lastIndexOf(":");
    if (sep === -1) return null;
    const score = Number(text.slice(0, sep));
    const id = text.slice(sep + 1);
    if (!Number.isFinite(score) || !id) return null;
    return { score, id };
  } catch {
    return null;
  }
}

export function clampLimit(raw: unknown): number {
  const n = typeof raw === "string" ? parseInt(raw, 10) : NaN;
  if (!Number.isFinite(n)) return FEED_DEFAULT_LIMIT;
  return Math.min(FEED_MAX_LIMIT, Math.max(1, n));
}

export async function getCommunityFeed(opts: {
  customerId?: string | null;
  cursor?: FeedCursor | null;
  limit?: number;
}): Promise<{ posts: FeedPost[]; nextCursor: string | null; hasMore: boolean }> {
  const limit = clampLimit(String(opts.limit ?? FEED_DEFAULT_LIMIT));
  const cursor = opts.cursor ?? null;
  // customerId is resolved server-side (visitorId cookie) — never from client input.
  const viewerId = opts.customerId ?? null;

  // Keyset condition on the computed score. Scores decay over time, so a tiny
  // epsilon is used for the equality branch; the id tiebreak keeps ordering stable.
  const cursorClause = cursor
    ? Prisma.sql`WHERE s.score < ${cursor.score} OR (ABS(s.score - ${cursor.score}) < 1e-9 AND s.id < ${cursor.id})`
    : Prisma.empty;

  const likedByMeExpr = viewerId
    ? Prisma.sql`EXISTS (SELECT 1 FROM "CommunityLike" ml WHERE ml."postId" = p.id AND ml."customerId" = ${viewerId})`
    : Prisma.sql`FALSE`;

  const commentedByMeExpr = viewerId
    ? Prisma.sql`EXISTS (SELECT 1 FROM "CommunityComment" mc WHERE mc."postId" = p.id AND mc."customerId" = ${viewerId})`
    : Prisma.sql`FALSE`;

  // Fetch one extra row to know whether another page exists.
  const take = limit + 1;

  const rows = await db.$queryRaw<FeedRow[]>`
    WITH scored AS (
      SELECT
        p.id,
        p."customerId",
        p.title,
        p.content,
        p."createdAt",
        cu.name AS "authorName",
        COUNT(DISTINCT l.id)::int AS "likeCount",
        COUNT(DISTINCT cm.id)::int AS "commentCount",
        (
          (COUNT(DISTINCT l.id) * ${LIKE_WEIGHT})
          + (COUNT(DISTINCT cm.id) * ${COMMENT_WEIGHT})
          - ((EXTRACT(EPOCH FROM (NOW() - p."createdAt")) / 3600.0) * ${DECAY_PER_HOUR})
        )::double precision AS score,
        (${likedByMeExpr}) AS "likedByMe",
        (${commentedByMeExpr}) AS "commentedByMe"
      FROM "CommunityPost" p
      LEFT JOIN "Customer" cu ON cu.id = p."customerId"
      LEFT JOIN "CommunityLike" l ON l."postId" = p.id
      LEFT JOIN "CommunityComment" cm ON cm."postId" = p.id
      GROUP BY p.id, cu.name
    )
    SELECT s.* FROM scored s
    ${cursorClause}
    ORDER BY s.score DESC, s.id DESC
    LIMIT ${take}
  `;

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page[page.length - 1];

  return {
    posts: page.map((r) => ({
      id: r.id,
      customerId: r.customerId,
      title: r.title,
      content: r.content,
      createdAt: r.createdAt,
      authorName: r.authorName,
      likeCount: Number(r.likeCount),
      commentCount: Number(r.commentCount),
      score: Number(r.score),
      likedByMe: r.likedByMe === true,
      commentedByMe: r.commentedByMe === true,
    })),
    nextCursor: last ? encodeCursor({ score: Number(last.score), id: last.id }) : null,
    hasMore,
  };
}
