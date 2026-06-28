// ============================================================
// 全站底部
// ============================================================

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌 */}
          <div>
            <h3 className="font-bold text-lg mb-3">ZShop</h3>
            <p className="text-sm text-gray-500">
              Your go-to destination for amazing deals. Group buy, bargain, and save big!
            </p>
          </div>

          {/* 购物 */}
          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/products" className="hover:text-orange-500">All Products</Link></li>
              <li><Link href="/group-buy" className="hover:text-orange-500">Group Buy</Link></li>
              <li><Link href="/products?sort=newest" className="hover:text-orange-500">New Arrivals</Link></li>
              <li><Link href="/products?sort=popular" className="hover:text-orange-500">Best Sellers</Link></li>
            </ul>
          </div>

          {/* 帮助 */}
          <div>
            <h4 className="font-semibold mb-3">Help</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/account/orders" className="hover:text-orange-500">Track Order</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Shipping Info</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-orange-500">FAQ</Link></li>
            </ul>
          </div>

          {/* 联系 */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>📧 support@zshop.com</li>
              <li>📞 1-800-ZSHOP-01</li>
              <li>🏢 San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ZShop. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <span>🔒 Secure Payments via Stripe</span>
            <span>📦 Free Shipping over $50</span>
            <span>🔄 30-Day Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
