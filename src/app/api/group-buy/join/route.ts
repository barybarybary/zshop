// ============================================================
// 加入拼团 API
// POST /api/group-buy/join
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
    const { groupBuyId } = await req.json();

    const groupBuy = await prisma.groupBuy.findUnique({
      where: { id: groupBuyId },
      include: { participants: true },
    });

    if (!groupBuy) {
      return NextResponse.json(
        { error: "Group buy not found" },
        { status: 404 }
      );
    }

    if (groupBuy.status !== "OPEN") {
      return NextResponse.json(
        { error: "This group buy is no longer open" },
        { status: 400 }
      );
    }

    if (new Date() > groupBuy.expireAt) {
      await prisma.groupBuy.update({
        where: { id: groupBuyId },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json(
        { error: "This group buy has expired" },
        { status: 400 }
      );
    }

    // 检查是否已经参与
    const alreadyJoined = groupBuy.participants.find(
      (p) => p.userId === userId
    );
    if (alreadyJoined) {
      return NextResponse.json(
        { error: "You've already joined this group buy" },
        { status: 400 }
      );
    }

    // 加入拼团
    await prisma.groupBuyParticipant.create({
      data: {
        groupBuyId,
        userId,
      },
    });

    const newCount = groupBuy.participants.length + 1;

    // 检查是否达到成团人数
    if (newCount >= groupBuy.minPeople) {
      await prisma.groupBuy.update({
        where: { id: groupBuyId },
        data: { status: "COMPLETED", currentPeople: newCount },
      });

      // 为所有参团者创建订单
      const orderNumber = `GRP${Date.now().toString(36).toUpperCase()}`;
      for (const participant of [...groupBuy.participants, { userId }]) {
        await prisma.order.create({
          data: {
            userId: participant.userId,
            orderNumber: `${orderNumber}-${participant.userId.slice(0, 4)}`,
            status: "PAID",
            subtotal: groupBuy.groupPrice,
            total: groupBuy.groupPrice,
            groupBuyId: groupBuy.id,
            items: {
              create: {
                productId: groupBuy.productId,
                name: "Group Buy Item",
                price: groupBuy.groupPrice,
                quantity: 1,
              },
            },
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "🎉 Group buy completed! Order has been created.",
        groupBuy: { ...groupBuy, status: "COMPLETED" },
      });
    }

    // 更新人数
    await prisma.groupBuy.update({
      where: { id: groupBuyId },
      data: { currentPeople: newCount },
    });

    return NextResponse.json({
      success: true,
      message: `Joined! ${newCount}/${groupBuy.minPeople} people. Need ${groupBuy.minPeople - newCount} more.`,
      currentPeople: newCount,
    });
  } catch (error) {
    console.error("Group buy join error:", error);
    return NextResponse.json(
      { error: "Failed to join group buy" },
      { status: 500 }
    );
  }
}
