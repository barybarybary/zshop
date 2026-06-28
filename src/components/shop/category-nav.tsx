// ============================================================
// 分类导航组件
// ============================================================

import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory?: string;
}

export function CategoryNav({ categories, activeCategory }: CategoryNavProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        href="/products"
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !activeCategory
            ? "bg-orange-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/products?category=${cat.slug}`}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === cat.slug
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat.image} {cat.name}
        </Link>
      ))}
    </div>
  );
}
