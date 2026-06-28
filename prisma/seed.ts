// ============================================================
// 种子数据 - 初始化数据库示例数据
// 运行: npx tsx prisma/seed.ts
// ============================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ========== 清理旧数据 ==========
  await prisma.bargainParticipant.deleteMany();
  await prisma.bargain.deleteMany();
  await prisma.groupBuyParticipant.deleteMany();
  await prisma.groupBuy.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.userCoupon.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // ========== 创建管理员 ==========
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@zshop.com",
      password: adminPassword,
      role: "ADMIN",
      referralCode: "ADMIN01",
      points: 9999,
    },
  });
  console.log(`  ✅ Admin: admin@zshop.com / admin123`);

  // ========== 创建 Moderator ==========
  const modPassword = await bcrypt.hash("mod123", 12);
  await prisma.user.create({
    data: {
      name: "Moderator",
      email: "mod@zshop.com",
      password: modPassword,
      role: "MODERATOR",
      referralCode: "MOD001",
    },
  });
  console.log(`  ✅ Moderator: mod@zshop.com / mod123`);

  // ========== 创建 Seller ==========
  const sellerPassword = await bcrypt.hash("seller123", 12);
  await prisma.user.create({
    data: {
      name: "Seller Wang",
      email: "seller@zshop.com",
      password: sellerPassword,
      role: "SELLER",
      referralCode: "SEL001",
    },
  });
  console.log(`  ✅ Seller: seller@zshop.com / seller123`);

  // ========== 创建 Support ==========
  const supportPassword = await bcrypt.hash("support123", 12);
  await prisma.user.create({
    data: {
      name: "Support Lisa",
      email: "support@zshop.com",
      password: supportPassword,
      role: "SUPPORT",
      referralCode: "SUP001",
    },
  });
  console.log(`  ✅ Support: support@zshop.com / support123`);

  // ========== 创建测试用户 ==========
  const userPassword = await bcrypt.hash("user123", 12);
  const testUser = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: userPassword,
      role: "USER",
      referralCode: "ZSJOHN1",
      points: 100,
    },
  });
  console.log(`  ✅ Test user: john@example.com / user123`);

  // ========== 创建优惠券 ==========
  const welcomeCoupon = await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minPurchase: 20,
      maxDiscount: 50,
      usageLimit: 100,
      isActive: true,
      expiresAt: new Date("2027-12-31"),
    },
  });

  const freeShipCoupon = await prisma.coupon.create({
    data: {
      code: "FREESHIP",
      type: "FREE_SHIPPING",
      value: 0,
      minPurchase: 30,
      isActive: true,
    },
  });

  // 给测试用户发优惠券
  await prisma.userCoupon.create({
    data: { userId: testUser.id, couponId: welcomeCoupon.id },
  });

  // ========== 创建分类 ==========
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Electronics", slug: "electronics", image: "📱" } }),
    prisma.category.create({ data: { name: "Fashion", slug: "fashion", image: "👗" } }),
    prisma.category.create({ data: { name: "Home & Garden", slug: "home-garden", image: "🏠" } }),
    prisma.category.create({ data: { name: "Beauty", slug: "beauty", image: "💄" } }),
    prisma.category.create({ data: { name: "Sports & Outdoors", slug: "sports", image: "⚽" } }),
    prisma.category.create({ data: { name: "Toys & Games", slug: "toys", image: "🧸" } }),
    prisma.category.create({ data: { name: "Kitchen", slug: "kitchen", image: "🍳" } }),
    prisma.category.create({ data: { name: "Books", slug: "books", image: "📚" } }),
  ]);
  console.log(`  ✅ ${categories.length} categories created`);

  // ========== 创建商品 ==========
  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      slug: "wireless-bluetooth-headphones",
      description: "Premium noise-cancelling wireless headphones with 30-hour battery life. Crystal clear audio with deep bass. Perfect for music, calls, and gaming.",
      price: 79.99,
      compareAtPrice: 129.99,
      categorySlug: "electronics",
      inventory: 200,
      isGroupBuy: true,
      isBargain: true,
      groupBuyMinPeople: 3,
      groupBuyExpireHours: 24,
      bargainMinPrice: 49.99,
      bargainMaxReduction: 30,
      images: ["https://picsum.photos/seed/headphones1/600/600", "https://picsum.photos/seed/headphones2/600/600"],
      variants: [
        { name: "Color", value: "Black", inventory: 100 },
        { name: "Color", value: "White", inventory: 60 },
        { name: "Color", value: "Blue", inventory: 40 },
      ],
    },
    {
      name: "Smart Watch Pro X",
      slug: "smart-watch-pro-x",
      description: "Advanced smartwatch with health monitoring, GPS tracking, and 7-day battery. Water resistant to 50m. Compatible with iOS and Android.",
      price: 199.99,
      compareAtPrice: 299.99,
      categorySlug: "electronics",
      inventory: 150,
      isGroupBuy: true,
      isBargain: true,
      groupBuyMinPeople: 2,
      groupBuyExpireHours: 48,
      bargainMinPrice: 149.99,
      bargainMaxReduction: 50,
      images: ["https://picsum.photos/seed/watch1/600/600", "https://picsum.photos/seed/watch2/600/600"],
      variants: [
        { name: "Size", value: "40mm", inventory: 70 },
        { name: "Size", value: "44mm", inventory: 80 },
      ],
    },
    {
      name: "Yoga Mat Premium",
      slug: "yoga-mat-premium",
      description: "Extra thick 6mm eco-friendly TPE yoga mat with alignment lines. Non-slip surface, includes carrying strap. Perfect for yoga, pilates, and stretching.",
      price: 34.99,
      compareAtPrice: 49.99,
      categorySlug: "sports",
      inventory: 500,
      isGroupBuy: true,
      isBargain: false,
      groupBuyMinPeople: 5,
      groupBuyExpireHours: 12,
      images: ["https://picsum.photos/seed/yogamat1/600/600", "https://picsum.photos/seed/yogamat2/600/600"],
      variants: [
        { name: "Color", value: "Purple", inventory: 200 },
        { name: "Color", value: "Blue", inventory: 150 },
        { name: "Color", value: "Green", inventory: 150 },
      ],
    },
    {
      name: "Stainless Steel Water Bottle",
      slug: "stainless-steel-water-bottle",
      description: "32oz double-wall vacuum insulated water bottle. Keeps drinks cold 24h or hot 12h. BPA-free, leak-proof, sweat-free. Perfect for gym, hiking, and office.",
      price: 24.99,
      compareAtPrice: 39.99,
      categorySlug: "sports",
      inventory: 300,
      isGroupBuy: true,
      isBargain: true,
      groupBuyMinPeople: 4,
      groupBuyExpireHours: 24,
      bargainMinPrice: 14.99,
      bargainMaxReduction: 10,
      images: ["https://picsum.photos/seed/bottle1/600/600", "https://picsum.photos/seed/bottle2/600/600"],
      variants: [
        { name: "Color", value: "Silver", inventory: 100 },
        { name: "Color", value: "Matte Black", inventory: 120 },
        { name: "Color", value: "Rose Gold", inventory: 80 },
      ],
    },
    {
      name: "LED Desk Lamp with USB Charger",
      slug: "led-desk-lamp",
      description: "Adjustable LED desk lamp with 5 brightness levels, 3 color modes, and built-in USB charging port. Eye-caring technology, touch control, 360° flexible gooseneck.",
      price: 39.99,
      compareAtPrice: 59.99,
      categorySlug: "home-garden",
      inventory: 180,
      isGroupBuy: false,
      isBargain: true,
      bargainMinPrice: 24.99,
      bargainMaxReduction: 15,
      images: ["https://picsum.photos/seed/lamp1/600/600", "https://picsum.photos/seed/lamp2/600/600"],
      variants: [
        { name: "Color", value: "White", inventory: 90 },
        { name: "Color", value: "Black", inventory: 90 },
      ],
    },
    {
      name: "Casual Denim Jacket",
      slug: "casual-denim-jacket",
      description: "Classic denim jacket made from 100% cotton. Comfortable fit with button closure, chest pockets, and adjustable waist tabs. Perfect for all seasons.",
      price: 59.99,
      compareAtPrice: 89.99,
      categorySlug: "fashion",
      inventory: 120,
      isGroupBuy: true,
      isBargain: false,
      groupBuyMinPeople: 3,
      groupBuyExpireHours: 36,
      images: ["https://picsum.photos/seed/jacket1/600/600", "https://picsum.photos/seed/jacket2/600/600"],
      variants: [
        { name: "Size", value: "S", inventory: 30 },
        { name: "Size", value: "M", inventory: 40 },
        { name: "Size", value: "L", inventory: 35 },
        { name: "Size", value: "XL", inventory: 15 },
      ],
    },
    {
      name: "Running Shoes UltraBoost",
      slug: "running-shoes-ultraboost",
      description: "Lightweight running shoes with responsive cushioning and breathable mesh upper. Rubber outsole for superior traction. Ideal for daily running and training.",
      price: 89.99,
      compareAtPrice: 139.99,
      categorySlug: "fashion",
      inventory: 90,
      isGroupBuy: true,
      isBargain: true,
      groupBuyMinPeople: 2,
      groupBuyExpireHours: 48,
      bargainMinPrice: 59.99,
      bargainMaxReduction: 30,
      images: ["https://picsum.photos/seed/shoes1/600/600", "https://picsum.photos/seed/shoes2/600/600"],
      variants: [
        { name: "Size", value: "US 7", inventory: 15 },
        { name: "Size", value: "US 8", inventory: 25 },
        { name: "Size", value: "US 9", inventory: 30 },
        { name: "Size", value: "US 10", inventory: 20 },
      ],
    },
    {
      name: "Organic Face Cream Set",
      slug: "organic-face-cream-set",
      description: "Complete skincare set with day cream, night cream, and eye serum. Made with organic ingredients. Suitable for all skin types. Dermatologist tested.",
      price: 45.99,
      compareAtPrice: 69.99,
      categorySlug: "beauty",
      inventory: 250,
      isGroupBuy: true,
      isBargain: true,
      groupBuyMinPeople: 3,
      groupBuyExpireHours: 24,
      bargainMinPrice: 29.99,
      bargainMaxReduction: 16,
      images: ["https://picsum.photos/seed/facecream1/600/600", "https://picsum.photos/seed/facecream2/600/600"],
      variants: [],
    },
    {
      name: "Cast Iron Dutch Oven",
      slug: "cast-iron-dutch-oven",
      description: "Pre-seasoned 6-quart cast iron dutch oven with lid. Perfect for slow cooking, baking, roasting, and more. Oven safe up to 500°F. Lifetime warranty.",
      price: 49.99,
      compareAtPrice: 79.99,
      categorySlug: "kitchen",
      inventory: 100,
      isGroupBuy: true,
      isBargain: false,
      groupBuyMinPeople: 4,
      groupBuyExpireHours: 48,
      images: ["https://picsum.photos/seed/dutchoven1/600/600", "https://picsum.photos/seed/dutchoven2/600/600"],
      variants: [
        { name: "Color", value: "Red", inventory: 35 },
        { name: "Color", value: "Blue", inventory: 35 },
        { name: "Color", value: "Black", inventory: 30 },
      ],
    },
    {
      name: "Building Blocks Set 1000pc",
      slug: "building-blocks-set-1000pc",
      description: "Creative building blocks set with 1000 pieces. Compatible with all major brands. Includes baseplate, wheels, windows, and instruction booklet. Ages 4+.",
      price: 29.99,
      compareAtPrice: 44.99,
      categorySlug: "toys",
      inventory: 400,
      isGroupBuy: true,
      isBargain: true,
      groupBuyMinPeople: 5,
      groupBuyExpireHours: 24,
      bargainMinPrice: 19.99,
      bargainMaxReduction: 10,
      images: ["https://picsum.photos/seed/blocks1/600/600", "https://picsum.photos/seed/blocks2/600/600"],
      variants: [],
    },
    {
      name: "Bestselling Fiction Novel 2025",
      slug: "bestselling-fiction-novel-2025",
      description: "The #1 New York Times bestseller that everyone is talking about. A gripping tale of mystery, love, and redemption. Hardcover edition with bonus content.",
      price: 18.99,
      compareAtPrice: 28.99,
      categorySlug: "books",
      inventory: 600,
      isGroupBuy: true,
      isBargain: true,
      groupBuyMinPeople: 2,
      groupBuyExpireHours: 72,
      bargainMinPrice: 9.99,
      bargainMaxReduction: 9,
      images: ["https://picsum.photos/seed/book1/600/600"],
      variants: [
        { name: "Format", value: "Hardcover", inventory: 300 },
        { name: "Format", value: "Paperback", inventory: 300 },
      ],
    },
    {
      name: "Portable Bluetooth Speaker",
      slug: "portable-bluetooth-speaker",
      description: "Compact waterproof Bluetooth speaker with 360° sound. 12-hour battery, built-in microphone, and floatable design. Perfect for pool parties and outdoor adventures.",
      price: 49.99,
      compareAtPrice: 69.99,
      categorySlug: "electronics",
      inventory: 170,
      isGroupBuy: true,
      isBargain: true,
      groupBuyMinPeople: 3,
      groupBuyExpireHours: 24,
      bargainMinPrice: 29.99,
      bargainMaxReduction: 20,
      images: ["https://picsum.photos/seed/speaker1/600/600", "https://picsum.photos/seed/speaker2/600/600"],
      variants: [
        { name: "Color", value: "Black", inventory: 60 },
        { name: "Color", value: "Blue", inventory: 55 },
        { name: "Color", value: "Red", inventory: 55 },
      ],
    },
  ];

  for (const productData of products) {
    const category = categories.find((c) => c.slug === productData.categorySlug);

    const product = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice,
        categoryId: category?.id || null,
        inventory: productData.inventory,
        isGroupBuy: productData.isGroupBuy,
        isBargain: productData.isBargain,
        groupBuyMinPeople: productData.groupBuyMinPeople,
        groupBuyExpireHours: productData.groupBuyExpireHours,
        bargainMinPrice: productData.bargainMinPrice,
        bargainMaxReduction: productData.bargainMaxReduction,
        sales: Math.floor(Math.random() * 500),
        views: Math.floor(Math.random() * 2000),
      },
    });

    // 创建图片
    for (let i = 0; i < productData.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: productData.images[i],
          alt: `${productData.name} image ${i + 1}`,
          order: i,
        },
      });
    }

    // 创建规格
    for (const variant of productData.variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: variant.name,
          value: variant.value,
          inventory: variant.inventory,
        },
      });
    }

    console.log(`  ✅ Product: ${product.name}`);
  }

  console.log(`\n🎉 Seed complete!`);
  console.log(`   Admin: admin@zshop.com / admin123`);
  console.log(`   User:  john@example.com / user123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
