// ============================================================
// 评价 API
// GET  /api/reviews?productId=xxx  - 获取商品评价
// POST /api/reviews                - 提交评价
// ============================================================

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, image: true } } },
  });

  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid review data" }, { status: 400 });
    }

    // 检查是否已经评价过
    const existing = await prisma.review.findFirst({
      where: { productId, userId },
    });

    if (existing) {
      return NextResponse.json({ error: "You've already reviewed this product" }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: { productId, userId, rating, comment: comment || "" },
      include: { user: { select: { name: true, image: true } } },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
