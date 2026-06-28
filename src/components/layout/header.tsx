"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart, User, Package, MapPin, LogOut, Search, Users, Zap } from "lucide-react";

export function Header() {
  const router = useRouter();
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (d?.user) setSession(d);
    });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    setSession(null);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap className="h-6 w-6 text-orange-500" />
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">ZShop</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium hover:text-orange-500">All Products</Link>
          <Link href="/group-buy" className="text-sm font-medium hover:text-orange-500 flex items-center gap-1"><Users className="h-4 w-4" /> Group Buy</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/products"><Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button></Link>
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-orange-500">{cartItemCount}</Badge>}
            </Button>
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden md:inline">{session.user.name}</span>
              <div className="relative group">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                    {(session.user.name || "U").charAt(0).toUpperCase()}
                  </div>
                </Button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs text-gray-500 border-b">{session.user.email}</div>
                    <button onClick={() => router.push("/account")} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"><User className="h-4 w-4" /> My Account</button>
                    <button onClick={() => router.push("/account/orders")} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"><Package className="h-4 w-4" /> My Orders</button>
                    <button onClick={() => router.push("/account/addresses")} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"><MapPin className="h-4 w-4" /> Addresses</button>
                    {session.user.role !== "USER" && (
                      <button onClick={() => router.push("/admin")} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 border-t">⚙️ Admin Panel</button>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-red-500 border-t"><LogOut className="h-4 w-4" /> Sign Out</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login"><Button size="sm" className="bg-orange-500 hover:bg-orange-600">Sign In</Button></Link>
          )}
        </div>
      </div>
    </header>
  );
}
