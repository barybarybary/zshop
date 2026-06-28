"use client";

// ============================================================
// Support 专属 - 退款处理
// ============================================================

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Undo } from "lucide-react";

export default function RefundManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders/list");
      const data = await res.json();
      // 只显示可能退款的订单
      setOrders(
        (data.orders || []).filter((o: any) =>
          ["PAID", "SHIPPED", "DELIVERED"].includes(o.status)
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (orderId: string) => {
    setProcessing(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action: "REFUNDED" }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Order refunded successfully!");
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        toast.error(data.error || "Refund failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Refund Management</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No orders requiring refund attention. 🎉
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm">
                      #{order.orderNumber}
                    </span>
                    <span className="font-medium">
                      {order.user.name || order.user.email}
                    </span>
                    <Badge className={
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "SHIPPED"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                    {order.items?.length || 0} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-orange-500">
                    ${order.total.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRefund(order.id)}
                    disabled={processing === order.id}
                  >
                    {processing === order.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Undo className="h-4 w-4 mr-1" /> Refund
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
