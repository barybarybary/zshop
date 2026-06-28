"use client";

// ============================================================
// 管理后台 - 订单管理（含操作按钮）
// ============================================================

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

// 每个状态下可执行的操作
const actions: Record<string, { label: string; action: string; color: string }[]> = {
  PENDING: [
    { label: "Mark Paid", action: "PAID", color: "bg-blue-500 hover:bg-blue-600" },
    { label: "Cancel", action: "CANCELLED", color: "bg-red-500 hover:bg-red-600" },
  ],
  PAID: [
    { label: "Ship", action: "SHIPPED", color: "bg-purple-500 hover:bg-purple-600" },
    { label: "Cancel", action: "CANCELLED", color: "bg-red-500 hover:bg-red-600" },
    { label: "Refund", action: "REFUNDED", color: "bg-gray-500 hover:bg-gray-600" },
  ],
  SHIPPED: [
    { label: "Mark Delivered", action: "DELIVERED", color: "bg-green-500 hover:bg-green-600" },
    { label: "Refund", action: "REFUNDED", color: "bg-gray-500 hover:bg-gray-600" },
  ],
  DELIVERED: [
    { label: "Refund", action: "REFUNDED", color: "bg-gray-500 hover:bg-gray-600" },
  ],
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string; email: string };
  items: OrderItem[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders/list");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (orderId: string, action: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Order ${action.toLowerCase()}!`);
        // 更新本地状态
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: action } : o))
        );
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
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
      <h1 className="text-2xl font-bold mb-6">Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-mono text-sm text-gray-500">
                      #{order.orderNumber}
                    </span>
                    <span className="ml-3 font-medium">
                      {order.user.name || order.user.email}
                    </span>
                    <span className="ml-3 text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <Badge className={`${statusColors[order.status]} text-sm px-3 py-1`}>
                    {order.status}
                  </Badge>
                </div>

                {/* 商品列表 */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-500 text-lg">
                    ${order.total.toFixed(2)}
                  </span>

                  {/* 操作按钮 */}
                  {actions[order.status] && actions[order.status].length > 0 && (
                    <div className="flex gap-2">
                      {actions[order.status].map((act) => (
                        <Button
                          key={act.action}
                          size="sm"
                          className={act.color}
                          onClick={() => handleAction(order.id, act.action)}
                          disabled={updatingId === order.id}
                        >
                          {updatingId === order.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            act.label
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
