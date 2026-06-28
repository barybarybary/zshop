"use client";

// ============================================================
// 砍价详情页 - 分享链接落地点
// ============================================================

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Zap, ArrowDown, Share2, Loader2, ShoppingCart } from "lucide-react";

export default function BargainPage() {
  const params = useParams();
  const router = useRouter();
  const { session } = useAuth();
  const [bargain, setBargain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [helping, setHelping] = useState(false);

  const bargainId = params.id as string;

  useEffect(() => {
    fetchBargain();
  }, [bargainId]);

  const fetchBargain = async () => {
    try {
      const res = await fetch(`/api/bargain?id=${bargainId}`);
      const data = await res.json();
      setBargain(data.bargain);
    } catch {
      toast.error("Failed to load bargain");
    } finally {
      setLoading(false);
    }
  };

  const handleHelp = async () => {
    if (!session?.user) {
      router.push(`/login?redirect=/bargain/${bargainId}`);
      return;
    }

    setHelping(true);
    try {
      const res = await fetch("/api/bargain/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bargainId }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Thanks for helping!");
        fetchBargain();
      } else {
        toast.error(data.error || "Failed to help");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setHelping(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "Help me bargain!",
        text: `Help me knock down the price on ZShop! Current price: $${bargain?.currentPrice?.toFixed(2)}`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied! Share with friends to get help.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  if (!bargain) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Bargain Not Found</h1>
        <Button onClick={() => router.push("/products")}>Browse Products</Button>
      </div>
    );
  }

  const totalReduction = bargain.originalPrice - bargain.currentPrice;
  const progress =
    ((bargain.originalPrice - bargain.currentPrice) /
      (bargain.originalPrice - bargain.targetPrice)) *
    100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="overflow-hidden">
        {/* 砍价头部 */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 text-center">
          <Zap className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Bargain Deal!</h1>
          <p className="text-white/80">
            Help {bargain.user.name} knock down the price!
          </p>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* 商品信息 */}
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <img
                src={bargain.product.images[0]?.url || ""}
                alt={bargain.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{bargain.product.name}</h3>
              <p className="text-sm text-gray-500">
                Started by {bargain.user.name}
              </p>
            </div>
          </div>

          {/* 价格展示 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 mb-1">Original Price</p>
            <p className="text-2xl font-bold text-gray-400 line-through">
              ${bargain.originalPrice.toFixed(2)}
            </p>
            <ArrowDown className="h-6 w-6 mx-auto my-2 text-green-500" />
            <p className="text-sm text-gray-500 mb-1">Current Price</p>
            <p className="text-4xl font-bold text-purple-600">
              ${bargain.currentPrice.toFixed(2)}
            </p>
            <p className="text-sm text-green-500 mt-1">
              Saved ${totalReduction.toFixed(2)} already!
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Target: ${bargain.targetPrice.toFixed(2)}
            </p>
          </div>

          {/* 操作按钮 */}
          {bargain.status === "ACTIVE" ? (
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-purple-500 hover:bg-purple-600"
                size="lg"
                onClick={handleHelp}
                disabled={helping}
              >
                {helping ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Help Bargain
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          ) : bargain.status === "SUCCESS" ? (
            <Button
              className="w-full bg-green-500 hover:bg-green-600"
              size="lg"
              onClick={() => toast.success("Order placed!")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy at ${bargain.currentPrice.toFixed(2)}
            </Button>
          ) : (
            <Badge className="w-full justify-center py-3 text-base">
              This bargain has expired
            </Badge>
          )}

          <Separator />

          {/* 帮砍记录 */}
          <div>
            <h3 className="font-semibold mb-3">
              Helpers ({bargain.participants.length})
            </h3>
            <div className="space-y-2">
              {bargain.participants.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={p.user.image || ""} />
                      <AvatarFallback>
                        {p.user.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{p.user.name}</span>
                  </div>
                  <span className="text-green-500 font-medium">
                    -${p.reducedAmount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
