// ============================================================
// 商品卡片组件
// ============================================================

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    images: { url: string; alt?: string | null }[];
    isGroupBuy: boolean;
    isBargain: boolean;
    sales: number;
    variants: { id: string }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images[0]?.url || "https://picsum.photos/seed/default/400/400";
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* 图片 */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={firstImage}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* 标签 */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600">-{discount}%</Badge>
            )}
            {product.isGroupBuy && (
              <Badge className="bg-orange-500 hover:bg-orange-600 gap-1">
                <Users className="h-3 w-3" /> Group
              </Badge>
            )}
            {product.isBargain && (
              <Badge className="bg-purple-500 hover:bg-purple-600 gap-1">
                <Zap className="h-3 w-3" /> Bargain
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-orange-500">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-2">
            {product.sales}+ sold
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
