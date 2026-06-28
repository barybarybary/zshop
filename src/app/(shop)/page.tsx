// ============================================================
// 首页 - ZShop 海外版拼多多
// ============================================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  Zap,
  TrendingUp,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* ========== Hero 区域 ========== */}
      <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 text-base px-4 py-2" variant="secondary">
            🔥 New: Group Buy is LIVE! Save up to 70%
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Shop Together,
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Save Together
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Join group buys, bargain for deals, and discover trending products at
            unbeatable prices. The more friends you bring, the more you save!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8">
                Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/group-buy">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Users className="mr-2 h-5 w-5" /> Join Group Buy
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 特色功能 ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Shop with ZShop?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 hover:border-orange-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-7 w-7 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 热门分类 ========== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trending Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/products?category=${cat.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{cat.icon}</div>
                    <h3 className="font-semibold group-hover:text-orange-500 transition-colors">
                      {cat.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA 区域 ========== */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Save Big?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of smart shoppers. Start a group buy, invite friends,
            and unlock massive discounts today!
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Sign Up Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ========== 底部保障 ========== */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-green-500" />
              <h4 className="font-semibold">Secure Payment</h4>
              <p className="text-sm text-gray-500">Powered by Stripe</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Truck className="h-8 w-8 text-blue-500" />
              <h4 className="font-semibold">Free Shipping</h4>
              <p className="text-sm text-gray-500">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RotateCcw className="h-8 w-8 text-purple-500" />
              <h4 className="font-semibold">30-Day Returns</h4>
              <p className="text-sm text-gray-500">Hassle-free returns</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// 数据
// ============================================================

const features = [
  {
    title: "Group Buy",
    description:
      "Team up with friends or join existing groups to unlock bulk discounts. The more people, the lower the price!",
    icon: Users,
  },
  {
    title: "Bargain for Deals",
    description:
      "Start a bargain on any product. Share with friends to help you knock down the price. Lowest price wins!",
    icon: Zap,
  },
  {
    title: "Trending Products",
    description:
      "Discover what's hot right now. Our algorithm surfaces the most popular products so you never miss out.",
    icon: TrendingUp,
  },
];

const categories = [
  { name: "Electronics", slug: "electronics", icon: "📱" },
  { name: "Fashion", slug: "fashion", icon: "👗" },
  { name: "Home & Garden", slug: "home-garden", icon: "🏠" },
  { name: "Beauty", slug: "beauty", icon: "💄" },
  { name: "Sports", slug: "sports", icon: "⚽" },
  { name: "Toys", slug: "toys", icon: "🧸" },
  { name: "Kitchen", slug: "kitchen", icon: "🍳" },
  { name: "Books", slug: "books", icon: "📚" },
];
