import { prisma } from "@/prisma/lib/prisma";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, maxViews, expiresAt } = body;

    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    const id = nanoid(8);

    const paste = await prisma.paste.create({
      data: {
        id,
        content,
        maxViews: maxViews ? Number(maxViews) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json(
      {
        id: paste.id,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/paste/${paste.id}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
