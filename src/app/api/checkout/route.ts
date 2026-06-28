// ============================================================
// Stripe Checkout API
// POST /api/checkout
// ============================================================

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in to checkout" },
        { status: 401 }
      );
    }

    const { items, address, total } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;

    // 尝试使用 Stripe (如果有密钥)
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (stripeKey && !stripeKey.startsWith("sk_test_placeholder")) {
      try {
        const { stripe } = await import("@/lib/stripe");

        // 创建 Stripe Checkout Session
        const lineItems = items.map((item: any) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100), // Stripe 用分
          },
          quantity: item.quantity,
        }));

        const checkoutSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/orders?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?cancelled=true`,
          shipping_address_collection: {
            allowed_countries: ["US", "CA"],
          },
          metadata: {
            userId,
          },
        });

        // 创建订单记录
        const orderNumber = `ORD${Date.now().toString(36).toUpperCase()}`;
        await prisma.order.create({
          data: {
            userId,
            orderNumber,
            status: "PENDING",
            subtotal: items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0),
            total,
            paymentIntentId: checkoutSession.id,
            items: {
              create: items.map((item: any) => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
              })),
            },
          },
        });

        return NextResponse.json({ url: checkoutSession.url });
      } catch (stripeError) {
        console.error("Stripe error:", stripeError);
      }
    }

    // ========== 模拟支付（无 Stripe 密钥时） ==========
    const orderNumber = `ORD${Date.now().toString(36).toUpperCase()}`;

    // 保存地址
    const savedAddress = await prisma.address.create({
      data: {
        userId,
        name: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        isDefault: true,
      },
    });

    // 创建订单
    await prisma.order.create({
      data: {
        userId,
        addressId: savedAddress.id,
        orderNumber,
        status: "PAID", // 模拟直接支付成功
        subtotal: items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0),
        total,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
      },
    });

    // 更新商品销量
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { sales: { increment: item.quantity } },
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      message: "Order placed successfully!",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed. Please try again." },
      { status: 500 }
    );
  }
}
