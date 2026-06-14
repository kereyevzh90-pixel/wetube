import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: videoId } = await params;
  const userId = session.user.id;

  const existing = await db.like.findUnique({
    where: { userId_videoId: { userId, videoId } },
  });

  if (existing) {
    await db.like.delete({ where: { userId_videoId: { userId, videoId } } });
    return NextResponse.json({ liked: false });
  }

  await db.like.create({ data: { userId, videoId } });
  return NextResponse.json({ liked: true });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id: videoId } = await params;

  const count = await db.like.count({ where: { videoId } });

  let liked = false;
  if (session?.user?.id) {
    const existing = await db.like.findUnique({
      where: { userId_videoId: { userId: session.user.id, videoId } },
    });
    liked = !!existing;
  }

  return NextResponse.json({ count, liked });
}
