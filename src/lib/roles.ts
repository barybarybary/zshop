// ============================================================
// 角色权限定义
// ============================================================

export type Role = "USER" | "ADMIN" | "MODERATOR" | "SELLER" | "SUPPORT";

// 哪些角色可以访问管理后台
export const STAFF_ROLES: Role[] = ["ADMIN", "MODERATOR", "SELLER", "SUPPORT"];

// 每个角色能看到的菜单
export const ROLE_MENUS: Record<Role, { href: string; label: string; icon: string }[]> = {
  USER: [],

  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/products", label: "Products", icon: "Package" },
    { href: "/admin/orders", label: "Orders", icon: "ShoppingCart" },
    { href: "/admin/group-buys", label: "Group Buys", icon: "Users" },
    { href: "/admin/bargains", label: "Bargains", icon: "Zap" },
    { href: "/admin/coupons", label: "Coupons", icon: "Ticket" },
    { href: "/admin/users", label: "Users", icon: "UserCog" },
  ],

  MODERATOR: [
    { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/products", label: "Review Products", icon: "Package" },
    { href: "/admin/reviews", label: "Reviews", icon: "Star" },
  ],

  SELLER: [
    { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/my-products", label: "My Products", icon: "Package" },
    { href: "/admin/add-product", label: "Add Product", icon: "Plus" },
    { href: "/admin/my-orders", label: "My Orders", icon: "ShoppingCart" },
  ],

  SUPPORT: [
    { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/orders", label: "Orders", icon: "ShoppingCart" },
    { href: "/admin/refunds", label: "Refunds", icon: "Undo" },
  ],
};

// 检查是否为员工角色
export function isStaff(role?: string): boolean {
  return STAFF_ROLES.includes(role as Role);
}
