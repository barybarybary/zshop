// ============================================================
// 管理员订单操作 API
// PATCH /api/admin/orders
// ============================================================

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { orderId, action } = await req.json();

    if (!orderId || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 状态流转规则
    const validTransitions: Record<string, string[]> = {
      PENDING: ["PAID", "CANCELLED"],
      PAID: ["SHIPPED", "CANCELLED", "REFUNDED"],
      SHIPPED: ["DELIVERED", "REFUNDED"],
      DELIVERED: ["REFUNDED"],
      CANCELLED: [],
      REFUNDED: [],
    };

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(action)) {
      return NextResponse.json(
        { error: `Cannot change from ${order.status} to ${action}` },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: action },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
