// ============================================================
// 商家入驻申请 API
// POST /api/seller/apply
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
    const { storeName, description, phone } = await req.json();

    if (!storeName || !description) {
      return NextResponse.json(
        { error: "Store name and description are required" },
        { status: 400 }
      );
    }

    // 更新用户角色为 SELLER（实际场景应该是 PENDING_SELLER，需要审核）
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: "SELLER",
        name: storeName,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application approved! You are now a seller.",
    });
  } catch (error) {
    console.error("Seller apply error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
