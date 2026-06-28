// ============================================================
// 帮砍 API
// POST /api/bargain/help
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
    const { bargainId } = await req.json();

    const bargain = await prisma.bargain.findUnique({
      where: { id: bargainId },
      include: { participants: true },
    });

    if (!bargain) {
      return NextResponse.json(
        { error: "Bargain not found" },
        { status: 404 }
      );
    }

    if (bargain.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "This bargain is no longer active" },
        { status: 400 }
      );
    }

    if (new Date() > bargain.expireAt) {
      await prisma.bargain.update({
        where: { id: bargainId },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json(
        { error: "This bargain has expired" },
        { status: 400 }
      );
    }

    // 检查是否已经帮砍过
    const alreadyHelped = bargain.participants.find(
      (p) => p.userId === userId
    );
    if (alreadyHelped) {
      return NextResponse.json(
        { error: "You've already helped with this bargain" },
        { status: 400 }
      );
    }

    // 随机砍掉 $0.50 ~ $5.00
    const reducedAmount = Math.random() * 4.5 + 0.5;
    const newPrice = Math.max(
      bargain.targetPrice,
      bargain.currentPrice - reducedAmount
    );

    const actualReduction = bargain.currentPrice - newPrice;

    await prisma.bargainParticipant.create({
      data: {
        bargainId,
        userId,
        reducedAmount: Math.round(actualReduction * 100) / 100,
      },
    });

    // 检查是否达到目标价
    const reachedTarget = newPrice <= bargain.targetPrice;

    await prisma.bargain.update({
      where: { id: bargainId },
      data: {
        currentPrice: Math.round(newPrice * 100) / 100,
        status: reachedTarget ? "SUCCESS" : "ACTIVE",
      },
    });

    if (reachedTarget) {
      return NextResponse.json({
        success: true,
        message: `🎉 Bargain successful! Final price: $${newPrice.toFixed(2)}`,
        currentPrice: Math.round(newPrice * 100) / 100,
        reachedTarget: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: `You helped reduce $${actualReduction.toFixed(2)}! Current price: $${newPrice.toFixed(2)}`,
      currentPrice: Math.round(newPrice * 100) / 100,
      reducedAmount: Math.round(actualReduction * 100) / 100,
      reachedTarget: false,
    });
  } catch (error) {
    console.error("Bargain help error:", error);
    return NextResponse.json(
      { error: "Failed to help bargain" },
      { status: 500 }
    );
  }
}
