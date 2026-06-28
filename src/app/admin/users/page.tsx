// ============================================================
// Admin 专属 - 用户管理
// ============================================================

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function UserManagement() {
  const session = await getSession();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN") redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true, reviews: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users ({users.length})</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Reviews</th>
                <th className="p-3">Points</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    {user.name || "N/A"}
                  </td>
                  <td className="p-3 text-gray-500">{user.email}</td>
                  <td className="p-3">
                    <Badge className={
                      user.role === "ADMIN"
                        ? "bg-red-100 text-red-700"
                        : user.role === "MODERATOR"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "SELLER"
                        ? "bg-blue-100 text-blue-700"
                        : user.role === "SUPPORT"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-3">{user._count.orders}</td>
                  <td className="p-3">{user._count.reviews}</td>
                  <td className="p-3">{user.points}</td>
                  <td className="p-3 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
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
