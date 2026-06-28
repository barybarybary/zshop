// ============================================================
// 砍价 API
// POST /api/bargain         - 发起砍价
// ============================================================

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { productId } = await req.json();

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isBargain) {
      return NextResponse.json(
        { error: "Product not available for bargain" },
        { status: 400 }
      );
    }

    // 检查是否已有活跃的砍价
    const existing = await prisma.bargain.findFirst({
      where: {
        productId,
        userId,
        status: "ACTIVE",
      },
    });

    if (existing) {
      return NextResponse.json({ bargain: existing });
    }

    const targetPrice = product.bargainMinPrice || product.price * 0.5;
    const maxReduction = product.bargainMaxReduction || product.price * 0.3;

    // 创建砍价
    const bargain = await prisma.bargain.create({
      data: {
        productId,
        userId,
        originalPrice: product.price,
        targetPrice,
        currentPrice: product.price - maxReduction * 0.2, // 自己先砍一刀
        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24小时
        participants: {
          create: {
            userId,
            reducedAmount: maxReduction * 0.2,
          },
        },
      },
      include: {
        product: {
          include: {
            images: { take: 1, orderBy: { order: "asc" } },
          },
        },
        participants: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({ bargain }, { status: 201 });
  } catch (error) {
    console.error("Bargain create error:", error);
    return NextResponse.json(
      { error: "Failed to create bargain" },
      { status: 500 }
    );
  }
}

// 获取砍价信息
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (id) {
      const bargain = await prisma.bargain.findUnique({
        where: { id },
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { order: "asc" } },
            },
          },
          user: { select: { name: true, image: true } },
          participants: {
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      });
      return NextResponse.json({ bargain });
    }

    if (userId) {
      const bargains = await prisma.bargain.findMany({
        where: { userId, status: "ACTIVE" },
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { order: "asc" } },
            },
          },
          participants: {
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      });
      return NextResponse.json({ bargains });
    }

    return NextResponse.json({ bargains: [] });
  } catch (error) {
    console.error("Bargain get error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bargain" },
      { status: 500 }
    );
  }
}
