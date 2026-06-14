import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { channelName } = await req.json();
  if (!channelName?.trim()) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  await db.user.update({
    where: { id: session.user.id },
    data: { channelName: channelName.trim() },
  });

  return NextResponse.json({ ok: true });
}
