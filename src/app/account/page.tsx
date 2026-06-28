// ============================================================
// 个人中心
// ============================================================

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Package, MapPin, Gift, Settings } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?redirect=/account");
  }

  const user = session.user as any;

  return (
    <div className="max-w-4xl mx-auto">
      {/* 用户信息卡片 */}
      <Card className="mb-8">
        <CardContent className="flex items-center gap-6 p-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="text-2xl">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name || "User"}</h1>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              Referral Code: <span className="font-mono font-bold">{user.referralCode || "N/A"}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 功能入口 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/account/orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <Package className="h-8 w-8 text-orange-500" />
              <div>
                <h3 className="font-semibold">My Orders</h3>
                <p className="text-sm text-gray-500">View and track your orders</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/account/addresses">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <MapPin className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Addresses</h3>
                <p className="text-sm text-gray-500">Manage shipping addresses</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <Gift className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="font-semibold">My Coupons</h3>
              <p className="text-sm text-gray-500">View available coupons</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <Settings className="h-8 w-8 text-gray-500" />
            <div>
              <h3 className="font-semibold">Settings</h3>
              <p className="text-sm text-gray-500">Account settings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
