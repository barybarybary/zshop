"use client";

// ============================================================
// 拼团广场 - 浏览和参与拼团
// ============================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Clock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GroupBuyItem {
  id: string;
  productId: string;
  status: string;
  minPeople: number;
  currentPeople: number;
  groupPrice: number;
  expireAt: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: { url: string }[];
  };
  initiator: {
    name: string;
    image: string;
  };
  _count: {
    participants: number;
  };
}

export default function GroupBuyPage() {
  const router = useRouter();
  const [groupBuys, setGroupBuys] = useState<GroupBuyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupBuys();
  }, []);

  const fetchGroupBuys = async () => {
    try {
      const res = await fetch("/api/group-buy?status=OPEN");
      const data = await res.json();
      setGroupBuys(data.groupBuys || []);
    } catch {
      toast.error("Failed to load group buys");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (groupBuyId: string) => {
    try {
      const res = await fetch("/api/group-buy/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupBuyId }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Joined successfully!");
        fetchGroupBuys(); // 刷新列表
      } else {
        toast.error(data.error || "Failed to join");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          <Users className="inline h-8 w-8 mr-2 text-orange-500" />
          Group Buy Deals
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Team up with other shoppers to unlock bulk discounts. The more people join, the lower the price!
        </p>
      </div>

      {groupBuys.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-20 w-20 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Active Group Buys</h2>
          <p className="text-gray-500 mb-6">
            Be the first to start a group buy and save big!
          </p>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => router.push("/products")}
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupBuys.map((gb) => {
            const progress = (gb.currentPeople / gb.minPeople) * 100;
            const timeLeft = Math.max(
              0,
              Math.floor(
                (new Date(gb.expireAt).getTime() - Date.now()) / (1000 * 60 * 60)
              )
            );

            return (
              <Card key={gb.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* 商品信息 */}
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={gb.product.images[0]?.url || ""}
                        alt={gb.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">
                        {gb.product.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-bold text-orange-500">
                          ${gb.groupPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${gb.product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{gb.currentPeople} joined</span>
                      <span className="text-gray-500">
                        Need {gb.minPeople - gb.currentPeople} more
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* 发起人 + 时间 */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={gb.initiator.image || ""} />
                        <AvatarFallback>
                          {gb.initiator.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-500">{gb.initiator.name}</span>
                    </div>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timeLeft}h left
                    </span>
                  </div>

                  {/* 操作按钮 */}
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => handleJoin(gb.id)}
                  >
                    Join Group Buy <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
