"use client";

// ============================================================
// 购物车页面
// ============================================================

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();

  const subtotal = getTotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingCart className="h-20 w-20 mx-auto text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">
          Looks like you haven&apos;t added anything yet. Start shopping and find great deals!
        </p>
        <Link href="/products">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <ArrowLeft className="mr-2 h-4 w-4" /> Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Shopping Cart ({items.length} items)</h1>
        <Button variant="ghost" onClick={clearCart} className="text-red-500">
          <Trash2 className="mr-2 h-4 w-4" /> Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 商品列表 */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-white rounded-xl border hover:shadow-sm transition-shadow"
            >
              {/* 商品图片 */}
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 商品信息 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.productName}</h3>
                {item.variantValue && (
                  <p className="text-sm text-gray-500">
                    {item.variantName}: {item.variantValue}
                  </p>
                )}
                <p className="text-orange-500 font-bold mt-1">
                  ${item.price.toFixed(2)}
                </p>

                {/* 数量控制 */}
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-auto text-red-500"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* 小计 */}
              <div className="text-right shrink-0">
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 订单摘要 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border p-6 sticky top-20">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={shipping === 0 ? "text-green-500" : ""}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-orange-500">${total.toFixed(2)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                <Truck className="inline h-3 w-3 mr-1" />
                Add ${(50 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}

            <Button
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
              size="lg"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Link
              href="/products"
              className="block text-center text-sm text-orange-500 hover:underline mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
