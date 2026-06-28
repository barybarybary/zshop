// ============================================================
// 我的订单
// ============================================================

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { OrderConfirm } from "@/components/shop/order-confirm";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?redirect=/account/orders");
  }

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Suspense fallback={null}>
        <OrderConfirm />
      </Suspense>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping and place your first order!</p>
          <Link href="/products">
            <Button className="bg-orange-500 hover:bg-orange-600">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[order.status] || ""}>
                        {order.status}
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-sm text-gray-400">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </span>
                    <span className="font-bold text-orange-500">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
