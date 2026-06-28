// ============================================================
// 管理后台首页 - 数据看板
// ============================================================

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Ticket,
} from "lucide-react";

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, totalRevenue, groupBuyCount, couponCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.groupBuy.count({ where: { status: "OPEN" } }),
      prisma.coupon.count({ where: { isActive: true } }),
    ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const stats = [
    { label: "Total Products", value: productCount, icon: Package, color: "text-blue-500" },
    { label: "Total Orders", value: orderCount, icon: ShoppingCart, color: "text-green-500" },
    { label: "Users", value: userCount, icon: Users, color: "text-purple-500" },
    { label: "Revenue", value: `$${((totalRevenue._sum.total || 0) / 100).toFixed(2)}`, icon: DollarSign, color: "text-orange-500" },
    { label: "Active Group Buys", value: groupBuyCount, icon: TrendingUp, color: "text-red-500" },
    { label: "Active Coupons", value: couponCount, icon: Ticket, color: "text-indigo-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 最近订单 */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium">Order #</th>
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium text-right">Total</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">{order.orderNumber}</td>
                  <td className="py-2">{order.user.name || order.user.email}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      order.status === "PAID" ? "bg-green-100 text-green-700" :
                      order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 text-right font-medium">${order.total.toFixed(2)}</td>
                  <td className="py-2 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
