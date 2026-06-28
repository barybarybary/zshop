// ============================================================
// Seller 专属 - 我的商品
// ============================================================

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function MyProducts() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!role || !["ADMIN", "SELLER"].includes(role)) redirect("/admin");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: { take: 1, orderBy: { order: "asc" } },
      category: true,
    },
  });

  // 实际系统里应该按 sellerId 过滤，这里演示所有商品
  const totalRevenue = products.reduce(
    (sum, p) => sum + p.sales * p.price,
    0
  );

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">My Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {products.reduce((s, p) => s + p.sales, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${totalRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2">Product</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2">Sales</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-2 flex items-center gap-2">
                    {p.images[0] && (
                      <img
                        src={p.images[0].url}
                        alt=""
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    {p.name}
                  </td>
                  <td className="py-2">${p.price.toFixed(2)}</td>
                  <td className="py-2">{p.inventory}</td>
                  <td className="py-2">{p.sales}</td>
                  <td className="py-2">
                    <Badge
                      className={
                        p.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100"
                      }
                    >
                      {p.status}
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
