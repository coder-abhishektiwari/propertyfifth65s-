"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { UserCircle, MessageCircle, Heart, Send, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useCustomer } from "@/components/providers/customer-context";
import {
  createCommunityPost,
  addComment,
  toggleLike,
  getCommunityPosts,
  getPostWithComments,
} from "@/lib/actions/community-actions";

function formatRelativeTime(date: Date | string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  customer: { name: string | null };
  _count: { comments: number; likes: number };
};

type Comment = {
  id: string;
  content: string;
  createdAt: Date | string;
  customer: { name: string | null };
};

export default function CommunityDiscussion({ initialPosts }: { initialPosts: Post[] }) {
  const { customer, openDialog } = useCustomer();
  const isDefencePersonnel = customer?.category === "DEFENCE_PERSONNEL";

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, startPostTransition] = useTransition();
  const [postError, setPostError] = useState("");

  // expanded post + comments
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [loadingComments, setLoadingComments] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);

  // Refresh post list from server
  const refreshPosts = useCallback(async () => {
    const res = await getCommunityPosts();
    if (res.success && res.posts) {
      setPosts(res.posts as Post[]);
    }
  }, []);

  // Load comments for a post
  const loadComments = useCallback(async (postId: string) => {
    setLoadingComments(postId);
    const res = await getPostWithComments(postId);
    if (res.success && res.post) {
      setCommentsMap((prev) => ({ ...prev, [postId]: (res.post as any).comments }));
    }
    setLoadingComments(null);
  }, []);

  // Toggle expand + load comments
  const toggleExpand = async (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      if (!commentsMap[postId]) {
        await loadComments(postId);
      }
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDefencePersonnel) { openDialog(); return; }
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    setPostError("");

    startPostTransition(async () => {
      const res = await createCommunityPost(customer!.id, newPostTitle, newPostContent);
      if (res.success) {
        setNewPostTitle("");
        setNewPostContent("");
        await refreshPosts();
      } else {
        setPostError(res.message || "Failed to post.");
      }
    });
  };

  const handleLike = async (postId: string) => {
    if (!isDefencePersonnel) { openDialog(); return; }
    const res = await toggleLike(postId, customer!.id);
    if (res.success) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, _count: { ...p._count, likes: p._count.likes + (res.liked ? 1 : -1) } }
            : p
        )
      );
    }
  };

  const handleAddComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!isDefencePersonnel) { openDialog(); return; }
    const content = commentInputs[postId] || "";
    if (!content.trim()) return;

    setCommentingPostId(postId);
    const res = await addComment(postId, customer!.id, content);
    setCommentingPostId(null);

    if (res.success) {
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      // Append the new comment optimistically
      const newComment: Comment = {
        id: (res.comment as any).id,
        content,
        createdAt: new Date(),
        customer: { name: customer!.name },
      };
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
      // Update count
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, _count: { ...p._count, comments: p._count.comments + 1 } }
            : p
        )
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-5 rounded flex overflow-hidden">
          <div className="flex-1 bg-warning" />
          <div className="flex-1 bg-card border-y border-border" />
          <div className="flex-1 bg-success" />
        </div>
        <h2 className="text-xl font-bold text-primary">Community Discussions</h2>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm bg-card rounded-xl border border-border-light">
            <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p>No discussions yet.</p>
            <p className="text-xs mt-1">Be the first to start one!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-card rounded-xl border border-border-light shadow-sm overflow-hidden"
            >
              {/* Post Body */}
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <UserCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-primary">
                        {post.customer?.name || "Defence Member"}
                      </span>
                      <span className="text-[10px] bg-success-bg text-success px-2 py-0.5 rounded-full font-semibold">
                        Defence Personnel
                      </span>
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(post.createdAt)}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-foreground mt-1">{post.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{post.content}</p>
                  </div>
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-1 px-4 py-2.5 bg-muted border-t border-border-light">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg hover:bg-destructive-bg"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{post._count.likes}</span>
                </button>
                <button
                  onClick={() => toggleExpand(post.id)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-info-bg"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{post._count.comments} {post._count.comments === 1 ? "reply" : "replies"}</span>
                  {expandedPostId === post.id ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>

              {/* Comments Section */}
              {expandedPostId === post.id && (
                <div className="border-t border-border-light">
                  {/* Comment Input */}
                  {isDefencePersonnel && (
                    <form
                      onSubmit={(e) => handleAddComment(e, post.id)}
                      className="flex gap-2 p-4 border-b border-border-light"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <UserCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary"
                        />
                        <button
                          type="submit"
                          disabled={commentingPostId === post.id || !(commentInputs[post.id] || "").trim()}
                          className="bg-primary text-inverse px-3 py-2 rounded-lg disabled:opacity-50 flex items-center gap-1"
                        >
                          {commentingPostId === post.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Comments List */}
                  <div className="divide-y divide-gray-50">
                    {loadingComments === post.id ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : (commentsMap[post.id] || []).length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No replies yet. Be the first!
                      </p>
                    ) : (
                      (commentsMap[post.id] || []).map((comment) => (
                        <div key={comment.id} className="flex gap-3 px-4 py-3">
                          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <UserCircle className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[11px] font-bold text-foreground">
                                {comment.customer?.name || "Member"}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {formatRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
