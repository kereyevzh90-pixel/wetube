import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: videoId } = await params;
  const comments = await db.comment.findMany({
    where: { videoId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, image: true } } },
  });
  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: videoId } = await params;
  const { text } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Empty comment" }, { status: 400 });
  }

  const comment = await db.comment.create({
    data: { text: text.trim(), userId: session.user.id, videoId },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json(comment);
}
