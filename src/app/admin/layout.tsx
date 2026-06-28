// ============================================================
// 管理后台布局 - 多角色支持
// ============================================================

import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { isStaff, ROLE_MENUS, type Role } from "@/lib/roles";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  Zap,
  ChevronLeft,
  Star,
  UserCog,
  Undo,
  Plus,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  Package: <Package className="h-4 w-4" />,
  ShoppingCart: <ShoppingCart className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Ticket: <Ticket className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Star: <Star className="h-4 w-4" />,
  UserCog: <UserCog className="h-4 w-4" />,
  Undo: <Undo className="h-4 w-4" />,
  Plus: <Plus className="h-4 w-4" />,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const role = (session?.user as any)?.role as Role | undefined;

  if (!session?.user || !isStaff(role)) {
    redirect("/login?redirect=/admin");
  }

  const menus = ROLE_MENUS[role!] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-orange-500 flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Store
            </Link>
            <span className="font-bold text-lg">Admin Panel</span>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
              {role}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {session.user.name || session.user.email}
          </span>
        </div>
      </header>

      <div className="flex">
        {/* 侧边栏 */}
        <aside className="w-56 bg-white border-r min-h-[calc(100vh-56px)] sticky top-14 p-4 hidden md:block">
          <nav className="space-y-1">
            {menus.map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                {iconMap[menu.icon] || menu.icon}
                {menu.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* 移动端菜单 */}
        <div className="md:hidden w-full overflow-x-auto border-b bg-white px-4 py-2">
          <div className="flex gap-2">
            {menus.map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600"
              >
                {menu.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 主内容 */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
