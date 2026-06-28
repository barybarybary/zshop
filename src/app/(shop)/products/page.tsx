// ============================================================
// 商品列表页
// ============================================================

import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/product-card";
import { SearchBar } from "@/components/shop/search-bar";
import { CategoryNav } from "@/components/shop/category-nav";
import Link from "next/link";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
    groupBuy?: string;
    bargain?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category || "";
  const sort = params.sort || "newest";
  const search = params.search || "";
  const groupBuy = params.groupBuy === "true";
  const bargain = params.bargain === "true";
  const page = parseInt(params.page || "1");
  const limit = 12;

  // 获取分类列表
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // 构建查询
  const where: any = { status: "ACTIVE" };
  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (groupBuy) where.isGroupBuy = true;
  if (bargain) where.isBargain = true;

  let orderBy: any = { createdAt: "desc" };
  switch (sort) {
    case "price-asc": orderBy = { price: "asc" }; break;
    case "price-desc": orderBy = { price: "desc" }; break;
    case "popular": orderBy = { sales: "desc" }; break;
    case "newest": orderBy = { createdAt: "desc" }; break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        variants: true,
        category: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {search ? `Search: "${search}"` : groupBuy ? "Group Buy Deals" : bargain ? "Bargain Deals" : "All Products"}
        </h1>
        <p className="text-gray-500">
          {total} product{total !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* 搜索栏 */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* 分类导航 */}
      <CategoryNav categories={categories} activeCategory={category} />

      {/* 过滤器 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "Newest", value: "newest" },
          { label: "Price: Low to High", value: "price-asc" },
          { label: "Price: High to Low", value: "price-desc" },
          { label: "Most Popular", value: "popular" },
        ].map((s) => {
          const isActive = sort === s.value;
          const href = `/products?${new URLSearchParams({
            ...(category && { category }),
            ...(search && { search }),
            sort: s.value,
          }).toString()}`;
          return (
            <Link
              key={s.value}
              href={href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      {/* 商品网格 */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const href = `/products?${new URLSearchParams({
                  ...(category && { category }),
                  ...(search && { search }),
                  sort,
                  page: p.toString(),
                }).toString()}`;
                return (
                  <Link
                    key={p}
                    href={href}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
