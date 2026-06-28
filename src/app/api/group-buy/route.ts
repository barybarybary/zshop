// ============================================================
// 拼团 API
// GET  /api/group-buy         - 获取拼团列表
// POST /api/group-buy         - 发起拼团
// ============================================================

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 获取拼团列表
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "OPEN";
    const productId = searchParams.get("productId");

    const where: any = { status };
    if (productId) where.productId = productId;

    const groupBuys = await prisma.groupBuy.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        product: {
          include: {
            images: { take: 1, orderBy: { order: "asc" } },
          },
        },
        initiator: { select: { name: true, image: true } },
        _count: { select: { participants: true } },
      },
    });

    return NextResponse.json({ groupBuys });
  } catch (error) {
    console.error("Group buy list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch group buys" },
      { status: 500 }
    );
  }
}

// 发起拼团
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { productId } = await req.json();

    // 获取商品信息
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isGroupBuy) {
      return NextResponse.json(
        { error: "Product not available for group buy" },
        { status: 400 }
      );
    }

    // 检查是否已有进行中的拼团
    const existing = await prisma.groupBuy.findFirst({
      where: {
        productId,
        initiatorId: userId,
        status: "OPEN",
      },
    });

    if (existing) {
      return NextResponse.json({ groupBuy: existing });
    }

    // 计算拼团价 (人数越多越便宜)
    const discountRate = 1 - (product.groupBuyMinPeople - 1) * 0.05;
    const groupPrice = Math.max(
      product.price * discountRate,
      product.price * 0.7
    );

    const groupBuy = await prisma.groupBuy.create({
      data: {
        productId,
        initiatorId: userId,
        minPeople: product.groupBuyMinPeople,
        groupPrice: Math.round(groupPrice * 100) / 100,
        expireAt: new Date(
          Date.now() + product.groupBuyExpireHours * 60 * 60 * 1000
        ),
        participants: {
          create: {
            userId,
            isInitiator: true,
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
        },
      },
    });

    return NextResponse.json({ groupBuy }, { status: 201 });
  } catch (error) {
    console.error("Group buy create error:", error);
    return NextResponse.json(
      { error: "Failed to create group buy" },
      { status: 500 }
    );
  }
}
