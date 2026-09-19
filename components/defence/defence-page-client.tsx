"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import {
  Shield, Users, Award, Newspaper, PlusCircle, MessageCircle,
  Heart, Send, ChevronDown, ChevronUp, X, Loader2, Trash2,
  UserCircle, BookOpen, LogIn, Megaphone, LayoutList, Activity
} from "lucide-react";
import { useCustomer } from "@/components/providers/customer-context";
import {
  createCommunityPost, addComment, toggleLike, deleteCommunityPost,
  getCommunityPosts, getPostWithComments, getMyPosts, getMyInteractions,
} from "@/lib/actions/community-actions";

/* ─────────── Types ─────────── */
type Customer = { id: string; name: string; category: string } | null;

type Post = {
  id: string; title: string; content: string;
  createdAt: string | Date;
  customerId?: string;
  customer: { name: string | null };
  _count: { comments: number; likes: number };
  likedByMe?: boolean;
  commentedByMe?: boolean;
};

type PostWithComments = Post & {
  comments: { id: string; content: string; createdAt: string | Date; customerId?: string; customer: { name: string | null } }[];
};

/* ─────────── Helpers ─────────── */
function relTime(d: Date | string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const CATEGORIES = [
  { label: "Indian Army",     icon: Shield, color: "text-success bg-success-bg border-success-border" },
  { label: "Indian Air Force",icon: Shield, color: "text-info bg-info-bg border-info-border" },
  { label: "Indian Navy",     icon: Shield, color: "text-info bg-info-bg border-info-border" },
  { label: "Veterans",        icon: Award,  color: "text-destructive bg-destructive-bg border-destructive-border" },
  { label: "Aspirants",       icon: Users,  color: "text-warning bg-warning-bg border-warning-border" },
];

/* ─────────── Sub-components ─────────── */

/* liked/commented flags (feed + interactions tab ke liye) */
function interactionLabel(liked: boolean, commented: boolean) {
  if (liked && commented) return "You have liked and commented on this.";
  if (liked) return "You have liked this post.";
  if (commented) return "You have commented on this.";
  return "";
}

/** Single post card with live comment expand */
function PostCard({ post, customerId, customerName, onLike, onDelete, interactionNote }: {
  post: PostWithComments | Post;
  customerId: string | null;
  customerName?: string;
  onLike: (postId: string) => void;
  onDelete?: (postId: string) => void;
  interactionNote?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<PostWithComments["comments"]>(
    "comments" in post ? post.comments : []
  );
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [liked, setLiked] = useState(post.likedByMe ?? false);
  const [commentCount, setCommentCount] = useState(post._count.comments);
  const [deleting, setDeleting] = useState(false);
  const { openDialog } = useCustomer();
  const isOwner = !!customerId && !!post.customerId && post.customerId === customerId;

  const handleExpand = async () => {
    if (!expanded && !("comments" in post)) {
      setLoadingComments(true);
      const res = await getPostWithComments(post.id, customerId ?? undefined);
      if (res.success && res.post) {
        const p = res.post as PostWithComments & { likedByMe?: boolean };
        // Mera comment hamesha sabse upar (fallback: client-side sort bhi)
        const mine = customerId ? p.comments.filter((c) => c.customerId === customerId) : [];
        const others = customerId ? p.comments.filter((c) => c.customerId !== customerId) : p.comments;
        setComments([...mine, ...others]);
        if (typeof p.likedByMe === "boolean") setLiked(p.likedByMe);
      }
      setLoadingComments(false);
    }
    setExpanded((v) => !v);
  };

  const handleLike = async () => {
    if (!customerId) { openDialog(); return; }
    const res = await toggleLike(post.id, customerId);
    if (res.success) {
      setLiked(res.liked ?? false);
      setLikeCount((c) => c + (res.liked ? 1 : -1));
      onLike(post.id);
    }
  };

  const handleDelete = async () => {
    if (!customerId || !onDelete) return;
    if (!confirm("Delete this post permanently?")) return;
    setDeleting(true);
    const res = await deleteCommunityPost(post.id, customerId);
    setDeleting(false);
    if (res.success) onDelete(post.id);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) { openDialog(); return; }
    if (!commentText.trim()) return;
    setSubmitting(true);
    const res = await addComment(post.id, customerId, commentText);
    if (res.success && res.comment) {
        const myName = customerName && customerName !== "Member" ? customerName : "You";
      setComments((prev) => [{
          id: (res.comment as any).id,
          content: commentText,
          createdAt: new Date(),
          customerId: customerId ?? undefined,
          customer: { name: myName },
        }, ...prev]);
      setCommentCount((c) => c + 1);
      setCommentText("");
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-card rounded-2xl border border-border-light shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <UserCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold text-primary">
                {post.customer?.name || "Defence Member"}
              </span>
              <span className="text-[10px] bg-success-bg text-success px-2 py-0.5 rounded-full font-semibold">
                Defence Personnel
              </span>
              <span className="text-[10px] text-muted-foreground">{relTime(post.createdAt)}</span>
            </div>
            <h4 className="font-bold text-sm text-foreground mb-1">{post.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{post.content}</p>
            {/* Meri interaction ka note (interactions tab me card ke upar) */}
            {interactionNote && (
              <p className="mt-2 text-[11px] font-semibold text-primary bg-primary/5 border border-primary/15 rounded-lg px-2.5 py-1.5">
                {interactionNote}
              </p>
            )}
          </div>
          {/* Apni post pe delete */}
          {isOwner && onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete my post"
              className="ml-2 shrink-0 self-start text-muted-foreground hover:text-destructive hover:bg-destructive-bg rounded-lg p-1.5 transition-colors disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-1 px-5 py-2.5 bg-muted border-t border-border-light">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs transition-colors px-3 py-1.5 rounded-lg ${
            liked
              ? "text-destructive hover:text-destructive bg-destructive-bg hover:bg-destructive-bg"
              : "text-muted-foreground hover:text-destructive hover:bg-destructive-bg"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-500 text-destructive" : ""}`} />
          <span>{likeCount}</span>
        </button>
        <button
          onClick={handleExpand}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-info-bg"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{commentCount} {commentCount === 1 ? "reply" : "replies"}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Comments */}
      {expanded && (
        <div className="border-t border-border-light">
          {/* Input */}
          {customerId && (
            <form onSubmit={handleComment} className="flex gap-2 p-4 border-b border-border-light">
              <input
                type="text"
                placeholder="Write a reply..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="bg-primary text-inverse px-3 py-2 rounded-lg disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
          )}
          {/* List */}
          <div className="divide-y divide-gray-50">
            {loadingComments ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-5">No replies yet. Be the first!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex gap-3 px-5 py-3">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <UserCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-bold text-foreground">{c.customer?.name || "Member"}</span>
                      <span className="text-[10px] text-muted-foreground">{relTime(c.createdAt)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Create Post Dialog */
function CreatePostDialog({ customerId, customerName, onCreated, onClose }: {
  customerId: string;
  customerName: string;
  onCreated: (post: Post) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Please enter a title."); return; }
    if (!content.trim()) { setError("Please add some content."); return; }
    setError("");
    start(async () => {
      const res = await createCommunityPost(customerId, title, content);
      if (res.success && res.post) {
        onCreated({
          ...res.post,
          createdAt: res.post.createdAt,
          customer: { name: customerName },
          _count: { comments: 0, likes: 0 },
        });
        onClose();
      } else {
        setError(res.message || "Failed to post.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim backdrop-blur-sm">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-accent" />
            <span className="font-bold text-primary">New Community Post</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
              Title / Question
            </label>
            <input
              type="text"
              placeholder="e.g. Best books for CDS preparation?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-[var(--navy)]/10"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
              Details
            </label>
            <textarea
              rows={4}
              placeholder="Share your question, experience, or information with the community..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-sm bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-[var(--navy)]/10 resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive bg-destructive-bg border border-destructive-border rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border-light">
            <p className="text-[10px] text-muted-foreground">Visible to all Defence Community members</p>
            <button
              type="submit"
              disabled={isPending || !title.trim() || !content.trim()}
              className="bg-primary text-inverse text-sm font-bold px-6 py-2.5 rounded-xl disabled:opacity-50 flex items-center gap-2 transition-opacity hover:opacity-90"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Posting..." : "Post Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Defence News sidebar - served from /api/news proxy (cached, 5 per View More) */
function DefenceNewsWidget() {
  const [articles, setArticles] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);

  /* Initial 5 on mount */
  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => {
        setArticles(Array.isArray(d?.results) ? d.results : []);
        setNextPage(typeof d?.nextPage === "string" ? d.nextPage : null);
        if (!d?.nextPage) setReachedEnd(true);
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  /* View More - fetch next 5 */
  const handleViewMore = () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);
    fetch(`/api/news?page=${encodeURIComponent(nextPage)}`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.results)) {
          setArticles((prev) => [...prev, ...d.results]);
        }
        if (typeof d?.nextPage === "string" && d.nextPage !== nextPage) {
          setNextPage(d.nextPage);
        } else {
          setNextPage(null);
          setReachedEnd(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  };

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-14 h-14 bg-border rounded-xl shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 bg-border rounded w-full" />
            <div className="h-3 bg-border rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );

  if (articles.length === 0)
    return <p className="text-xs text-muted-foreground py-2">No updates currently.</p>;

  return (
    <div className="space-y-3">
      {articles.map((a: any, i: number) => (
        <a
          key={`${a.article_id}-${i}`}
          href={a.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex gap-3 p-2.5 rounded-xl bg-muted hover:bg-primary/5 border border-border-light hover:border-primary/20 transition-all"
        >
          {a.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={a.image_url} alt={a.title} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-accent opacity-70" />
            </div>
          )}
          <div className="flex flex-col justify-between overflow-hidden">
            <h4 className="text-xs font-semibold text-foreground group-hover:text-primary line-clamp-2 leading-snug">{a.title}</h4>
            <p className="text-[10px] text-muted-foreground mt-1">
              {new Date(a.pubDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
            </p>
          </div>
        </a>
      ))}
      {reachedEnd ? (
        <p className="text-center text-[11px] font-bold text-muted-foreground pt-1">
          You have reached the end.
        </p>
      ) : (
        <button
          type="button"
          onClick={handleViewMore}
          disabled={loadingMore || !nextPage}
          className="w-full mt-1 text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/20 rounded-xl py-2 hover:bg-primary hover:text-inverse transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingMore ? "Loading..." : "View More"}
        </button>
      )}
    </div>
  );
}

export default function DefencePageClient({
  initialPosts,
  customer: serverCustomer,
}: {
  initialPosts: Post[];
  customer: { id: string; name: string; email: string; phone: string; category: string } | null;
}) {
  const { customer: ctxCustomer, openDialog } = useCustomer();

  // Prefer live context customer (updated when they verify in dialog)
  const customer = ctxCustomer ?? serverCustomer;
  const isDefence = customer?.category === "DEFENCE_PERSONNEL";
  const customerId = customer?.id ?? null;
  const customerName = customer?.name ?? "Member";

  const [tab, setTab] = useState<"feed" | "mine" | "interactions">("feed");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [myPosts, setMyPosts] = useState<PostWithComments[]>([]);
  const [myPostsLoaded, setMyPostsLoaded] = useState(false);
  const [myPostsLoading, setMyPostsLoading] = useState(false);
  const [interactions, setInteractions] = useState<Post[]>([]);
  const [interactionsLoaded, setInteractionsLoaded] = useState(false);
  const [interactionsLoading, setInteractionsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const loadInteractions = async () => {
    if (!customerId) return;
    setInteractionsLoading(true);
    const res = await getMyInteractions(customerId);
    if (res.success) setInteractions((res.posts ?? []) as Post[]);
    setInteractionsLoaded(true);
    setInteractionsLoading(false);
  };

  const handleTabChange = async (t: "feed" | "mine" | "interactions") => {
    setTab(t);
    if (t === "mine" && !myPostsLoaded && customerId) {
      setMyPostsLoading(true);
      const res = await getMyPosts(customerId);
      if (res.success) setMyPosts((res.posts ?? []) as PostWithComments[]);
      setMyPostsLoaded(true);
      setMyPostsLoading(false);
    }
    if (t === "interactions" && !interactionsLoaded && customerId) {
      await loadInteractions();
    }
  };

  const handlePostCreated = async (newPost: Post) => {
    // Refresh full list from server to get accurate data
    const res = await getCommunityPosts({ customerId: customerId ?? undefined });
    if (res.success && res.posts) setPosts(res.posts as Post[]);
    setMyPostsLoaded(false); // force my-posts reload next time
    setInteractionsLoaded(false); // force interactions reload next time
  };

  const handleLike = useCallback(async (postId: string) => {
    // Like/comment ke baad: feed + interactions flags fresh karo (naya tab click pe reload ki bhi zaroorat kam hogi)
    if (!customerId) return;
    const [feedRes, intRes] = await Promise.all([
      getCommunityPosts({ customerId }),
      getMyInteractions(customerId),
    ]);
    if (feedRes.success && feedRes.posts) setPosts(feedRes.posts as Post[]);
    if (intRes.success && intRes.posts) {
      setInteractions(intRes.posts as Post[]);
      setInteractionsLoaded(true);
    }
  }, [customerId]);

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setMyPosts((prev) => prev.filter((p) => p.id !== postId));
    setInteractions((prev) => prev.filter((p) => p.id !== postId));
  };

  const openCreate = () => {
    if (!isDefence) { openDialog(); return; }
    setShowCreateDialog(true);
  };

  return (
    <div className="min-h-screen bg-muted">

      {/* ── Hero Banner ── */}
      <section className="relative pt-24 pb-14 lg:pt-32 lg:pb-20 bg-primary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 pointer-events-none"
          style={{ backgroundImage: "url('/images/hero/defence_hero.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/30 to-transparent/30" />

        <div className="container-site relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">
                Indian Armed Forces
              </p>
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-inverse mb-3 leading-tight">
                DEFENCE{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-500">
                  COMMUNITY
                </span>
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {isDefence
                  ? `Welcome, ${customerName}. Connect, discuss and stay updated with your fellow defence personnel.`
                  : "A platform for serving personnel, veterans, and aspirants to connect and share."}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-inverse">{posts.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Discussions</p>
              </div>
              <div className="w-px bg-card/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-inverse">
                  {posts.reduce((s, p) => s + p._count.comments, 0)}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Replies</p>
              </div>
            </div>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-4 mt-10 pt-6 border-t border-inverse/10">
            {[
              { icon: Users, label: "Connect", sub: "with Defence Personnel" },
              { icon: Newspaper, label: "Latest News", sub: "& Updates" },
              { icon: BookOpen, label: "Learn & Share", sub: "Knowledge" },
              { icon: Shield, label: "Verified", sub: "Defence Forum" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <f.icon className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-inverse text-xs font-semibold leading-none">{f.label}</p>
                  <p className="text-muted-foreground text-[10px]">{f.sub}</p>
                </div>
                {i < 3 && <div className="w-px h-6 bg-card/10 ml-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Jai Hind */}
        <div className="absolute bottom-8 right-10 hidden lg:block opacity-70 select-none">
          <p className="font-serif italic text-4xl text-inverse -rotate-12">Jai Hind</p>
          <div className="w-20 h-0.5 mt-1 bg-gradient-to-r from-orange-500 via-white to-green-500 -rotate-12" />
        </div>
      </section>

      {/* ── Body ── */}
      <section className="py-10">
        <div className="container-site">

          {/* Main grid */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Left: Feed ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Tab bar + action */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1 bg-card border border-border-light rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => handleTabChange("feed")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      tab === "feed"
                        ? "bg-primary text-inverse shadow-sm"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    Community Feed
                  </button>
                  {isDefence && (
                    <>
                      <button
                        onClick={() => handleTabChange("mine")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                          tab === "mine"
                            ? "bg-primary text-inverse shadow-sm"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <UserCircle className="w-3.5 h-3.5" />
                        My Discussions
                      </button>
                      <button
                        onClick={() => handleTabChange("interactions")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                          tab === "interactions"
                            ? "bg-primary text-inverse shadow-sm"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <Activity className="w-3.5 h-3.5" />
                        My Interactions
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={openCreate}
                  className="flex items-center gap-2 bg-primary text-inverse text-xs font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Post
                </button>
              </div>

              {/* If not defence, show join prompt */}
              {!isDefence && (
                <div className="bg-gradient-to-r from-warning-bg to-accent-soft border border-warning-border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-warning mb-1">Join the Defence Community</p>
                    <p className="text-xs text-warning">
                      Only verified Defence Personnel can post, reply, and like. Verify your identity to participate.
                    </p>
                  </div>
                  <button
                    onClick={openDialog}
                    className="flex items-center gap-2 bg-primary text-inverse text-xs font-bold px-5 py-2.5 rounded-xl shrink-0"
                  >
                    <LogIn className="w-4 h-4" />
                    Verify & Join
                  </button>
                </div>
              )}

              {/* ─ FEED TAB ─ */}
              {tab === "feed" && (
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-2xl border border-border-light">
                      <MessageCircle className="w-10 h-10 mx-auto text-border mb-3" />
                      <p className="text-sm text-muted-foreground">No discussions yet.</p>
                      {isDefence && (
                        <button onClick={openCreate} className="mt-4 text-xs font-bold text-primary underline underline-offset-2">
                          Start the first one
                        </button>
                      )}
                    </div>
                  ) : (
                    posts.map((p) => (
                      <PostCard key={p.id} post={p} customerId={customerId} customerName={customerName} onLike={handleLike} onDelete={handleDelete} />
                    ))
                  )}
                </div>
              )}

              {/* ─ MY DISCUSSIONS TAB ─ */}
              {tab === "mine" && (
                <div className="space-y-4">
                  {myPostsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : myPosts.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-2xl border border-border-light">
                      <MessageCircle className="w-10 h-10 mx-auto text-border mb-3" />
                      <p className="text-sm text-muted-foreground">You haven't posted yet.</p>
                      <button onClick={openCreate} className="mt-4 text-xs font-bold text-primary underline underline-offset-2">
                        Create your first post
                      </button>
                    </div>
                  ) : (
                    myPosts.map((p) => (
                      <PostCard key={p.id} post={p} customerId={customerId} customerName={customerName} onLike={handleLike} onDelete={handleDelete} />
                    ))
                  )}
                </div>
              )}

              {/* ─ MY INTERACTIONS TAB ─ */}
              {tab === "interactions" && (
                <div className="space-y-4">
                  {interactionsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : interactions.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-2xl border border-border-light">
                      <Activity className="w-10 h-10 mx-auto text-border mb-3" />
                      <p className="text-sm text-muted-foreground">No interactions yet.</p>
                      <p className="mt-1 text-xs text-muted-foreground">Like or reply to a post and it will appear here.</p>
                    </div>
                  ) : (
                    interactions.map((p) => (
                      <PostCard
                        key={p.id}
                        post={p}
                        customerId={customerId}
                        customerName={customerName}
                        onLike={handleLike}
                        onDelete={handleDelete}
                        interactionNote={interactionLabel(p.likedByMe ?? false, p.commentedByMe ?? false)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* ── Right Sidebar: News ── */}
            <div className="space-y-5">
              <div className="bg-card rounded-2xl border border-border-light shadow-sm p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-light">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-accent" />
                    <h3 className="font-bold text-sm text-primary">Defence Bulletin</h3>
                  </div>
                  <span className="text-[10px] font-bold text-success bg-success-bg px-2 py-0.5 rounded-full">
                    Today
                  </span>
                </div>
                <DefenceNewsWidget />
              </div>

              {/* Support banner
              <div className="relative rounded-2xl overflow-hidden h-44 flex flex-col justify-end p-5 shadow-sm border border-border">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/sections/defence-support.webp')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
                <div className="relative z-10">
                  <p className="text-inverse font-bold text-base leading-tight uppercase tracking-wide">
                    Support Our<br />Defenders
                  </p>
                  <div className="w-10 h-0.5 mt-2 bg-gradient-to-r from-orange-500 via-white to-green-500" />
                </div>
              </div> */}
             
            </div>

          </div>
        </div>
      </section>

      {/* Create Post Dialog */}
      {showCreateDialog && customerId && (
        <CreatePostDialog
          customerId={customerId}
          customerName={customerName}
          onCreated={handlePostCreated}
          onClose={() => setShowCreateDialog(false)}
        />
      )}
    </div>
  );
}
