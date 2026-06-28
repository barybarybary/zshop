"use client";

// ============================================================
// 商品详情客户端组件
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/shop/product-card";
import { ReviewForm } from "@/components/shop/review-form";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import {
  Users,
  Zap,
  Star,
  ShoppingCart,
  Share2,
  Heart,
  ChevronLeft,
  Minus,
  Plus,
} from "lucide-react";

export function ProductDetailClient({ product, relatedProducts }: any) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(product.reviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[selectedImage]?.url || product.images[0]?.url,
      variantName: product.variants.length > 0 ? product.variants[0]?.name : undefined,
      variantValue: selectedVariant || undefined,
      price: product.price,
      quantity,
      maxQuantity: product.inventory,
    });
    toast.success("Added to cart!", {
      description: `${product.name} x ${quantity}`,
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 面包屑 */}
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-gray-500 hover:text-orange-500 mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* ===== 左侧：图片 ===== */}
        <div className="space-y-4">
          {/* 主图 */}
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img
              src={product.images[selectedImage]?.url || "https://picsum.photos/seed/default/600/600"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* 缩略图 */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    idx === selectedImage ? "border-orange-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || ""}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== 右侧：商品信息 ===== */}
        <div className="space-y-6">
          {/* 分类 */}
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-sm text-orange-500 hover:underline"
            >
              {product.category.name}
            </Link>
          )}

          {/* 标题 */}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* 评价 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{avgRating}</span>
            </div>
          <span className="text-sm text-gray-500">
            ({reviews.length} reviews)
          </span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-500">{product.sales}+ sold</span>
          </div>

          {/* 价格 */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-orange-500">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
                <Badge className="bg-red-500">-{discount}% OFF</Badge>
              </>
            )}
          </div>

          {/* 拼团/砍价入口 */}
          <div className="flex gap-3">
            {product.isGroupBuy && (
              <Badge className="gap-1 px-3 py-2 text-base bg-orange-500">
                <Users className="h-4 w-4" /> Group Buy Available
              </Badge>
            )}
            {product.isBargain && (
              <Badge className="gap-1 px-3 py-2 text-base bg-purple-500">
                <Zap className="h-4 w-4" /> Bargain Available
              </Badge>
            )}
          </div>

          <Separator />

          {/* 规格选择 */}
          {product.variants.length > 0 && (
            <div>
              {Array.from(new Set(product.variants.map((v: any) => v.name))).map((name: any) => (
                <div key={name} className="mb-4">
                  <label className="text-sm font-medium mb-2 block">{name}</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants
                      .filter((v: any) => v.name === name)
                      .map((variant: any) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant.value)}
                          className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                            selectedVariant === variant.value
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {variant.value}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 数量 */}
          <div>
            <label className="text-sm font-medium mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>

            {product.isGroupBuy && (
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/group-buy?product=${product.slug}`)}
              >
                <Users className="mr-2 h-5 w-5" /> Start Group Buy
              </Button>
            )}

            {product.isBargain && (
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => toast.info("Bargain feature coming soon!")}
              >
                <Zap className="mr-2 h-5 w-5" /> Bargain Now
              </Button>
            )}

            <Button variant="outline" size="icon" className="shrink-0">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="shrink-0">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Separator />

          {/* 描述 */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* ===== 评价区域 ===== */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Customer Reviews ({reviews.length})
          </h2>
          <Button
            variant="outline"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </Button>
        </div>

        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm
              productId={product.id}
              onSubmitted={() => {
                setShowReviewForm(false);
                // 刷新评价
                fetch(`/api/reviews?productId=${product.id}`)
                  .then((r) => r.json())
                  .then((d) => setReviews(d.reviews || []));
              }}
            />
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{review.user.name}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No reviews yet. Be the first to review!</p>
        )}
      </section>

      {/* ===== 相关商品 ===== */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
