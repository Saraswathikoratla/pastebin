import { prisma } from "@/prisma/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Correct way to get path params in App Router
    const pathname = req.nextUrl.pathname;

    // /api/pastes/XXXX
    const id = pathname.split("/").pop();

    console.log("PATH:", pathname);
    console.log("ID:", id);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
      );
    }

    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    console.log("PASTE:", paste);

    if (!paste) {
      return NextResponse.json(
        { message: "Paste not found" },
        { status: 404 }
      );
    }

    // Expire by views
    if (paste.maxViews != null && paste.views >= paste.maxViews) {
      await prisma.paste.delete({ where: { id } });

      return NextResponse.json(
        { message: "Paste expired" },
        { status: 410 }
      );
    }

    // Increment views
    const updated = await prisma.paste.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
    });

    return NextResponse.json({
      id: updated.id,
      content: updated.content,
      views: updated.views,
    });

  } catch (err) {
    console.error("GET ERROR:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
