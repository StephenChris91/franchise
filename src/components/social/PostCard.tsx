"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, MoreHorizontal, Flag, Pencil, Trash2, Pin, EyeOff } from "lucide-react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import { toggleReaction, deletePost, reportContent } from "@/lib/actions/social";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { SocialPost, Group } from "../../../db/schema";

const REACTIONS = [
  { type: "like" as const, emoji: "👍", label: "Like" },
  { type: "amen" as const, emoji: "🙏", label: "Amen" },
  { type: "praying" as const, emoji: "🕊️", label: "Praying" },
  { type: "heart" as const, emoji: "❤️", label: "Heart" },
];

const POST_TYPE_BADGES: Record<string, { label: string; className: string }> = {
  prayer: { label: "Prayer", className: "bg-purple-100 text-purple-700" },
  testimony: { label: "Testimony", className: "bg-green-100 text-green-700" },
  announcement: { label: "Announcement", className: "bg-[#af601a]/10 text-[#af601a]" },
  regular: { label: "", className: "" },
};

interface ReactionCounts {
  like: number; amen: number; praying: number; heart: number;
}

interface Props {
  post: SocialPost;
  author: { name: string; username: string; photoUrl?: string | null };
  group?: Pick<Group, "id" | "name" | "slug"> | null;
  reactionCounts: ReactionCounts;
  userReactions: string[];
  currentUserId?: string;
  currentUserRole?: string;
  onCommentClick?: () => void;
}

function renderContent(content: string): string {
  try {
    const json = JSON.parse(content);
    return generateHTML(json, [StarterKit, TiptapLink]);
  } catch {
    return `<p>${content}</p>`;
  }
}

export default function PostCard({
  post,
  author,
  group,
  reactionCounts,
  userReactions,
  currentUserId,
  currentUserRole,
  onCommentClick,
}: Props) {
  const [localCounts, setLocalCounts] = useState(reactionCounts);
  const [localUserReactions, setLocalUserReactions] = useState(userReactions);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showReport, setShowReport] = useState(false);

  const isAuthor = currentUserId === post.authorId;
  const isAdmin = currentUserRole === "admin" || currentUserRole === "pastor";
  const typeBadge = POST_TYPE_BADGES[post.postType];
  const initials = author.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  function handleReaction(type: "like" | "amen" | "praying" | "heart") {
    const hasIt = localUserReactions.includes(type);
    setLocalCounts((c) => ({ ...c, [type]: c[type] + (hasIt ? -1 : 1) }));
    setLocalUserReactions((r) => hasIt ? r.filter((t) => t !== type) : [...r, type]);
    startTransition(() => void toggleReaction(post.id, type).catch(() => {
      setLocalCounts(reactionCounts);
      setLocalUserReactions(userReactions);
    }));
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    startTransition(() => void deletePost(post.id));
  }

  const totalReactions = Object.values(localCounts).reduce((a, b) => a + b, 0);
  const html = renderContent(post.content);

  return (
    <>
      <article className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <Link href={`/social/members/${author.username}`}>
              {author.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={author.photoUrl} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#af601a] to-[#e8913a] flex items-center justify-center text-sm font-bold text-white">
                  {initials}
                </div>
              )}
            </Link>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link href={`/social/members/${author.username}`} className="text-sm font-semibold text-gray-900 hover:underline">
                  {author.name}
                </Link>
                {group && (
                  <>
                    <span className="text-gray-400 text-xs">in</span>
                    <Link href={`/social/groups/${group.slug}`} className="text-xs font-medium text-[#af601a] hover:underline">
                      {group.name}
                    </Link>
                  </>
                )}
                {typeBadge.label && (
                  <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", typeBadge.className)}>
                    {typeBadge.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {isAuthor && (
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                  <Trash2 size={14} className="mr-2" /> Delete
                </DropdownMenuItem>
              )}
              {isAdmin && !isAuthor && (
                <>
                  <DropdownMenuItem onClick={() => startTransition(() => void import("@/lib/actions/social").then(m => m.hidePost(post.id)))}>
                    <EyeOff size={14} className="mr-2" /> Hide
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => startTransition(() => void import("@/lib/actions/social").then(m => m.pinPost(post.id)))}>
                    <Pin size={14} className="mr-2" /> Pin
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {!isAuthor && (
                <DropdownMenuItem onClick={() => setShowReport(true)}>
                  <Flag size={14} className="mr-2" /> Report
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div
          className="prose prose-sm max-w-none text-gray-800 [&_a]:text-[#af601a] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Media */}
        {post.mediaUrls.length > 0 && (
          <div className={cn("grid gap-1 rounded-xl overflow-hidden", post.mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
            {post.mediaUrls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt=""
                className="w-full aspect-square object-cover cursor-pointer hover:opacity-95 transition"
                onClick={() => setLightboxUrl(url)}
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* Reaction summary */}
        {totalReactions > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 border-b border-gray-100 pb-2">
            <span className="flex">
              {REACTIONS.filter((r) => localCounts[r.type] > 0).slice(0, 3).map((r) => (
                <span key={r.type}>{r.emoji}</span>
              ))}
            </span>
            <span>{totalReactions}</span>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-1 flex-wrap">
          {REACTIONS.map((r) => (
            <button
              key={r.type}
              onClick={() => handleReaction(r.type)}
              disabled={isPending || !currentUserId}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition",
                localUserReactions.includes(r.type)
                  ? "bg-[#af601a]/10 text-[#af601a]"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <span>{r.emoji}</span>
              {localCounts[r.type] > 0 && <span>{localCounts[r.type]}</span>}
            </button>
          ))}

          <button
            onClick={onCommentClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:bg-gray-100 transition ml-auto"
          >
            <MessageCircle size={14} />
            {post.commentCount > 0 ? post.commentCount : "Comment"}
          </button>
        </div>
      </article>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightboxUrl} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}

      {/* Report modal */}
      {showReport && (
        <ReportModal
          onClose={() => setShowReport(false)}
          onSubmit={async (reason, notes) => {
            await reportContent({ postId: post.id, reason, notes });
            setShowReport(false);
          }}
        />
      )}
    </>
  );
}

function ReportModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (reason: "spam" | "inappropriate" | "harassment" | "misinformation" | "other", notes: string) => Promise<void>;
}) {
  const [reason, setReason] = useState<"spam" | "inappropriate" | "harassment" | "misinformation" | "other">("spam");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-semibold text-gray-900 mb-4">Report post</h3>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value as typeof reason)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#af601a]"
        >
          <option value="spam">Spam</option>
          <option value="inappropriate">Inappropriate content</option>
          <option value="harassment">Harassment</option>
          <option value="misinformation">Misinformation</option>
          <option value="other">Other</option>
        </select>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional details (optional)"
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#af601a] mb-4"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={() => startTransition(() => onSubmit(reason, notes))}
            disabled={isPending}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
          >
            {isPending ? "Sending…" : "Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
