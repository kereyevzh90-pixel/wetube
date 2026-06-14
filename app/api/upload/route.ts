import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("video") as File | null;
  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;

  if (!file || !title?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "mp4";
  const filename = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(filename, file, { access: "public" });

  const video = await db.video.create({
    data: {
      title: title.trim(),
      description: description?.trim() ?? null,
      filename: blob.url,
      userId: session.user.id,
    },
  });

  return NextResponse.json(video);
}
