"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";

interface VideoUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: VideoUser;
}

interface Video {
  id: string;
  title: string;
  description: string | null;
  filename: string;
  views: number;
  createdAt: string;
  likeCount: number;
  user: VideoUser;
}

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "только что";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} дн. назад`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} мес. назад`;
  return `${Math.floor(diff / 31536000)} г. назад`;
}

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} тыс.`;
  return `${n}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" });
}

export default function WatchClient({ video, initialComments }: { video: Video; initialComments: Comment[] }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likeCount);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  async function toggleLike() {
    if (!session) { signIn("google"); return; }
    const res = await fetch(`/api/videos/${video.id}/like`, { method: "POST" });
    const data = await res.json();
    setLiked(data.liked);
    setLikeCount((prev) => prev + (data.liked ? 1 : -1));
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { signIn("google"); return; }
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch(`/api/videos/${video.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: commentText }),
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    }
    setSubmitting(false);
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col lg:flex-row gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* Video player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <video
              src={video.filename}
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>

          {/* Title */}
          <h1 className="text-[18px] font-semibold text-white mt-3 mb-2 leading-snug">{video.title}</h1>

          {/* Channel row + actions */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            {/* Channel */}
            <div className="flex items-center gap-3">
              {video.user.image ? (
                <Image src={video.user.image} alt="" width={40} height={40} className="rounded-full w-10 h-10 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                  {video.user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              <div>
                <p className="text-white font-medium text-sm leading-tight">{video.user.name}</p>
                <p className="text-[#aaa] text-xs">подписчики</p>
              </div>
              <button className="ml-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition">
                Подписаться
              </button>
            </div>

            {/* Like / share */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
                <button
                  onClick={toggleLike}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition border-r border-[#3f3f3f] ${
                    liked ? "text-white" : "text-white hover:bg-[#3f3f3f]"
                  }`}
                >
                  <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {likeCount > 0 ? formatViews(likeCount) : "Нравится"}
                </button>
                <button className="px-3 py-2 text-white hover:bg-[#3f3f3f] transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 13l-3 3 3 3M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21H11M7 16V5a2 2 0 012-2h2.095c.5 0 .905.405.905.905 0 .714.211 1.412.608 2.006L17 11" />
                  </svg>
                </button>
              </div>

              <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-white text-sm font-medium px-4 py-2 rounded-full transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Поделиться
              </button>
            </div>
          </div>

          {/* Description */}
          <div
            className="bg-[#272727] rounded-xl p-3 mb-6 cursor-pointer hover:bg-[#3f3f3f] transition"
            onClick={() => setDescExpanded(!descExpanded)}
          >
            <p className="text-white text-sm font-medium mb-1">
              {formatViews(video.views)} просмотров &bull; {formatDate(video.createdAt)}
            </p>
            {video.description ? (
              <p className={`text-gray-300 text-sm whitespace-pre-wrap ${descExpanded ? "" : "line-clamp-2"}`}>
                {video.description}
              </p>
            ) : null}
            <p className="text-white text-sm font-semibold mt-1">
              {descExpanded ? "Скрыть" : "Ещё"}
            </p>
          </div>

          {/* Comments */}
          <div>
            <h2 className="text-white font-semibold text-base mb-5">{comments.length} комментариев</h2>

            {/* Comment form */}
            <form onSubmit={submitComment} className="flex gap-3 mb-8">
              <div className="shrink-0">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="" width={36} height={36} className="rounded-full w-9 h-9 object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#606060] flex items-center justify-center text-white text-sm font-bold">
                    {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onClick={() => { if (!session) signIn("google"); }}
                  placeholder={session ? "Добавьте комментарий..." : "Войдите, чтобы комментировать"}
                  className="w-full bg-transparent border-b border-[#3f3f3f] focus:border-white outline-none text-white text-sm py-1.5 placeholder:text-[#aaa] transition"
                  readOnly={!session}
                />
                {commentText && (
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setCommentText("")}
                      className="text-white text-sm px-4 py-2 rounded-full hover:bg-[#272727] transition"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#3d98ff] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-500 transition disabled:opacity-50"
                    >
                      Оставить комментарий
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Comments list */}
            <div className="space-y-5">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  {c.user.image ? (
                    <Image src={c.user.image} alt="" width={36} height={36} className="rounded-full shrink-0 w-9 h-9 object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#606060] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {c.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white text-sm font-medium">{c.user.name}</span>
                      <span className="text-[#aaa] text-xs">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-[#f1f1f1] text-sm leading-snug">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
