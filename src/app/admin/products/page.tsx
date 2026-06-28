// ============================================================
// 管理后台 - 商品管理
// ============================================================

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { take: 1, orderBy: { order: "asc" } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products ({products.length})</h1>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Inventory</th>
                <th className="p-3 font-medium">Sales</th>
                <th className="p-3 font-medium">Features</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0">
                        {product.images[0] && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-medium hover:text-orange-500"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-500">
                    {product.category?.name || "-"}
                  </td>
                  <td className="p-3 font-medium">${product.price.toFixed(2)}</td>
                  <td className="p-3">{product.inventory}</td>
                  <td className="p-3">{product.sales}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {product.isGroupBuy && (
                        <Badge variant="outline" className="text-xs">Group</Badge>
                      )}
                      {product.isBargain && (
                        <Badge variant="outline" className="text-xs">Bargain</Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className={
                      product.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }>
                      {product.status}
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
