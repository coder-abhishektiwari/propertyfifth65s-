"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type FeedQuery = {
  customerId?: string;
};

/* likedByMe + commentedByMe flags compute karein (sirf jab customerId mile) */
function withInteractionFlags<
  T extends {
    likes?: { customerId: string }[];
    comments?: { customerId: string }[];
  },
>(post: T, customerId?: string) {
  const likedByMe = customerId
    ? (post.likes ?? []).some((l) => l.customerId === customerId)
    : false;
  const commentedByMe = customerId
    ? (post.comments ?? []).some((c) => c.customerId === customerId)
    : false;
  const { likes: _omitLikes, comments: _omitComments, ...rest } = post;
  return { ...rest, likedByMe, commentedByMe };
}

export async function getCommunityPosts(query?: FeedQuery) {
  try {
    const customerId = query?.customerId;
    const posts = await db.communityPost.findMany({
      include: {
        customer: { select: { name: true, category: true } },
        _count: { select: { comments: true, likes: true } },
        // Per-user flags ke liye sirf customerId chahiye (data leak nahi)
        likes: customerId
          ? { where: { customerId }, select: { customerId: true } }
          : false,
        comments: customerId
          ? { where: { customerId }, select: { customerId: true } }
          : false,
      },
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      posts: posts.map((p) => withInteractionFlags(p, customerId)),
    };
  } catch (error) {
    console.error("Error fetching community posts:", error);
    return { success: false, message: "Failed to fetch posts", posts: [] };
  }
}

export async function getMyPosts(customerId: string) {
  try {
    const posts = await db.communityPost.findMany({
      where: { customerId },
      include: {
        customer: { select: { name: true } },
        _count: { select: { comments: true, likes: true } },
        comments: {
          include: { customer: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, posts };
  } catch (error) {
    console.error("Error fetching my posts:", error);
    return { success: false, message: "Failed to fetch posts", posts: [] };
  }
}

export async function getPostWithComments(postId: string, customerId?: string) {
  try {
    const post = await db.communityPost.findUnique({
      where: { id: postId },
      include: {
        customer: { select: { name: true } },
        _count: { select: { likes: true, comments: true } },
        comments: {
          include: { customer: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
        likes: customerId
          ? { where: { customerId }, select: { customerId: true } }
          : false,
      },
    });
    if (!post) return { success: false, message: "Post not found" };
    // Mera comment hamesha sabse upar (sirf logged-in user ke liye)
    const all = post.comments ?? [];
    const comments = customerId
      ? [
          ...all.filter((c) => c.customerId === customerId),
          ...all.filter((c) => c.customerId !== customerId),
        ]
      : all;
    const likedByMe = customerId
      ? (post.likes ?? []).some((l) => l.customerId === customerId)
      : false;
    const { likes: _omitLikes, ...rest } = post;
    return { success: true, post: { ...rest, comments, likedByMe } };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { success: false, message: "Failed to fetch post" };
  }
}

export async function createCommunityPost(customerId: string, title: string, content: string) {
  if (!title.trim() || !content.trim())
    return { success: false, message: "Title and content are required." };

  try {
    const customer = await db.customer.findUnique({ where: { id: customerId } });
    if (!customer || customer.category !== "DEFENCE_PERSONNEL")
      return { success: false, message: "Only Defence Personnel can post." };

    const post = await db.communityPost.create({
      data: { title: title.trim(), content: content.trim(), customerId },
    });

    revalidatePath("/defence");
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, message: "Failed to create post." };
  }
}

export async function deleteCommunityPost(postId: string, customerId: string) {
  if (!postId || !customerId)
    return { success: false, message: "Invalid request." };

  try {
    const post = await db.communityPost.findUnique({
      where: { id: postId },
      select: { customerId: true },
    });
    if (!post) return { success: false, message: "Post not found." };
    // Sirf apni post delete ho sakti hai
    if (post.customerId !== customerId)
      return { success: false, message: "You can only delete your own post." };

    // Likes + comments cascade se auto-delete ho jayenge
    await db.communityPost.delete({ where: { id: postId } });

    revalidatePath("/defence");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, message: "Failed to delete post." };
  }
}

export async function getMyInteractions(customerId: string) {
  if (!customerId) return { success: false, message: "Not logged in", posts: [] };

  try {
    const posts = await db.communityPost.findMany({
      where: {
        OR: [
          { likes: { some: { customerId } } },
          { comments: { some: { customerId } } },
        ],
      },
      include: {
        customer: { select: { name: true, category: true } },
        _count: { select: { comments: true, likes: true } },
        likes: { where: { customerId }, select: { customerId: true } },
        comments: { where: { customerId }, select: { customerId: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      posts: posts.map((p) => withInteractionFlags(p, customerId)),
    };
  } catch (error) {
    console.error("Error fetching interactions:", error);
    return { success: false, message: "Failed to fetch interactions", posts: [] };
  }
}

export async function addComment(postId: string, customerId: string, content: string) {
  if (!content.trim()) return { success: false, message: "Comment cannot be empty." };

  try {
    const customer = await db.customer.findUnique({ where: { id: customerId } });
    if (!customer || customer.category !== "DEFENCE_PERSONNEL")
      return { success: false, message: "Only Defence Personnel can comment." };

    const comment = await db.communityComment.create({
      data: { content: content.trim(), postId, customerId },
    });

    revalidatePath("/defence");
    return { success: true, comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, message: "Failed to add comment." };
  }
}

export async function toggleLike(postId: string, customerId: string) {
  try {
    const customer = await db.customer.findUnique({ where: { id: customerId } });
    if (!customer || customer.category !== "DEFENCE_PERSONNEL")
      return { success: false, message: "Only Defence Personnel can like." };

    const existing = await db.communityLike.findUnique({
      where: { postId_customerId: { postId, customerId } },
    });

    if (existing) {
      await db.communityLike.delete({ where: { id: existing.id } });
    } else {
      await db.communityLike.create({ data: { postId, customerId } });
    }

    revalidatePath("/defence");
    return { success: true, liked: !existing };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, message: "Failed to update like." };
  }
}
