import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import WatchClient from "./WatchClient";

export const dynamic = "force-dynamic";

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const video = await db.video.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true } },
    },
  });

  if (!video) notFound();

  await db.video.update({ where: { id }, data: { views: { increment: 1 } } });

  const comments = await db.comment.findMany({
    where: { videoId: id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return (
    <WatchClient
      video={{
        ...video,
        createdAt: video.createdAt.toISOString(),
        likeCount: video._count.likes,
      }}
      initialComments={comments.map((c: { id: string; text: string; createdAt: Date; user: { id: string; name: string | null; image: string | null } }) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      }))}
    />
  );
}
