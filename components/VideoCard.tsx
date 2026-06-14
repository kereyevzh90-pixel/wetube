import Link from "next/link";
import Image from "next/image";

interface VideoCardProps {
  id: string;
  title: string;
  views: number;
  createdAt: string;
  thumbnail: string | null;
  filename: string;
  user: { id: string; name: string | null; image: string | null };
}

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн просм.`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} тыс. просм.`;
  return `${n} просм.`;
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

export default function VideoCard({ id, title, views, createdAt, thumbnail, filename, user }: VideoCardProps) {
  return (
    <Link href={`/watch/${id}`} className="group block w-full min-w-0">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-[#272727] rounded-xl overflow-hidden mb-3">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-200" />
        ) : (
          <video
            src={`/uploads/${filename}`}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
          />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info row */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? ""}
              width={36}
              height={36}
              className="rounded-full w-9 h-9 object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-medium line-clamp-2 leading-snug mb-0.5">{title}</p>
          <p className="text-[#aaa] text-xs truncate">{user.name}</p>
          <p className="text-[#aaa] text-xs whitespace-nowrap">
            {formatViews(views)} &bull; {timeAgo(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
