// 管理后台 - 砍价管理
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminBargains() {
  const bargains = await prisma.bargain.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
      user: { select: { name: true } },
      _count: { select: { participants: true } },
    },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bargains</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium">User</th>
                <th className="p-3 font-medium">Original → Current</th>
                <th className="p-3 font-medium">Helpers</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bargains.map((b) => (
                <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3">{b.product.name}</td>
                  <td className="p-3">{b.user.name}</td>
                  <td className="p-3">
                    <span className="text-gray-400 line-through">${b.originalPrice.toFixed(2)}</span>{" "}
                    → <span className="font-medium text-purple-600">${b.currentPrice.toFixed(2)}</span>
                  </td>
                  <td className="p-3">{b._count.participants}</td>
                  <td className="p-3">
                    <Badge className={
                      b.status === "SUCCESS" ? "bg-green-100 text-green-700" :
                      b.status === "ACTIVE" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }>
                      {b.status}
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
