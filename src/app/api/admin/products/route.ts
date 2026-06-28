// ============================================================
// 商品管理 API (Seller/Admin)
// POST /api/admin/products - 添加商品
// ============================================================

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isStaff } from "@/lib/roles";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const role = (session?.user as any)?.role;
    if (!session?.user || !isStaff(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, description, price, categoryId, inventory, isGroupBuy, isBargain } = await req.json();

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || "",
        price: parseFloat(price),
        categoryId: categoryId || null,
        inventory: parseInt(inventory) || 0,
        isGroupBuy: isGroupBuy === "true" || isGroupBuy === true,
        isBargain: isBargain === "true" || isBargain === true,
        groupBuyMinPeople: 2,
        groupBuyExpireHours: 24,
        bargainMinPrice: parseFloat(price) * 0.5,
        bargainMaxReduction: parseFloat(price) * 0.3,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
