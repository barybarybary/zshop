// 管理后台 - 优惠券管理
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminCoupons() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" /> Create Coupon
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-3 font-medium">Code</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Value</th>
                <th className="p-3 font-medium">Min Purchase</th>
                <th className="p-3 font-medium">Used</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-mono font-bold">{coupon.code}</td>
                  <td className="p-3 capitalize">{coupon.type.replace("_", " ").toLowerCase()}</td>
                  <td className="p-3">
                    {coupon.type === "PERCENTAGE" ? `${coupon.value}%` :
                     coupon.type === "FIXED" ? `$${coupon.value}` : "Free"}
                  </td>
                  <td className="p-3">
                    {coupon.minPurchase ? `$${coupon.minPurchase}` : "-"}
                  </td>
                  <td className="p-3">
                    {coupon.usedCount}{coupon.usageLimit > 0 ? `/${coupon.usageLimit}` : ""}
                  </td>
                  <td className="p-3">
                    <Badge className={
                      coupon.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
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
