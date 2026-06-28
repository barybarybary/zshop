// ============================================================
// 认证页面布局 - 居中简洁
// ============================================================

import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Zap className="h-8 w-8 text-orange-500" />
        <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          ZShop
        </span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
