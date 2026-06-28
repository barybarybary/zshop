// 管理后台 - 拼团管理
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminGroupBuys() {
  const groupBuys = await prisma.groupBuy.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
      initiator: { select: { name: true } },
      _count: { select: { participants: true } },
    },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Group Buys</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium">Initiator</th>
                <th className="p-3 font-medium">Progress</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {groupBuys.map((gb) => (
                <tr key={gb.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3">{gb.product.name}</td>
                  <td className="p-3">{gb.initiator.name}</td>
                  <td className="p-3">
                    {gb._count.participants}/{gb.minPeople}
                  </td>
                  <td className="p-3">
                    <Badge className={
                      gb.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      gb.status === "OPEN" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }>
                      {gb.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(gb.createdAt).toLocaleDateString()}
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
