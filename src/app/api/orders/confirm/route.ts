// ============================================================
// 支付成功确认 - 更新订单状态
// POST /api/orders/confirm
// ============================================================

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // 找到用户最近的一个 PENDING 订单，更新为 PAID
    const order = await prisma.order.findFirst({
      where: { userId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    if (!order) {
      return NextResponse.json({ message: "No pending orders found" });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Confirm order error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
