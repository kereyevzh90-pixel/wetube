import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const videos = await db.video.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
  return NextResponse.json(videos);
}
