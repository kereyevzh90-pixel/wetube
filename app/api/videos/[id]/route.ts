import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const video = await db.video.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.video.update({ where: { id }, data: { views: { increment: 1 } } });

  return NextResponse.json(video);
}
