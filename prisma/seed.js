const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Admin user
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@knozstore.com" },
    update: {},
    create: {
      email: "admin@knozstore.com",
      passwordHash,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("Admin user created:", admin.email);

  // 2. Categories
  const categoryData = [
    { name: "مجات", slug: "mugs", description: "مجات مخصصة بتصاميم مختلفة" },
    { name: "منتجات مخصصة", slug: "custom-products", description: "منتجات يمكنك تخصيصها بالكامل" },
    { name: "Stickers", slug: "stickers", description: "استيكرز متنوعة" },
    { name: "Themes", slug: "themes", description: "ثيمات للمنتجات" },
    { name: "هدايا", slug: "gifts", description: "هدايا مخصصة لجميع المناسبات" },
    { name: "جديدنا", slug: "new-arrivals", description: "أحدث المنتجات" },
  ];

  const categories = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    categories[cat.slug] = created;
  }
  console.log("Categories seeded:", Object.keys(categories).length);

  // 3. Themes
  const themeData = [
    { name: "فضاء", slug: "space", description: "ثيم الفضاء والنجوم" },
    { name: "محيط", slug: "ocean", description: "ثيم المحيط والأعماق" },
    { name: "غابة", slug: "forest", description: "ثيم الغابة والطبيعة" },
    { name: "المدينة", slug: "city", description: "ثيم المدينة والعمارة" },
    { name: "الكون", slug: "universe", description: "ثيم الكون والمجرات" },
  ];

  const themes = {};
  for (const t of themeData) {
    const created = await prisma.theme.upsert({
      where: { slug: t.slug },
      update: { name: t.name, description: t.description },
      create: t,
    });
    themes[t.slug] = created;
  }
  console.log("Themes seeded:", Object.keys(themes).length);

  // 4. Stickers
  const stickerData = [
    { name: "صاروخ", slug: "rocket", description: "استيكر صاروخ" },
    { name: "قلب", slug: "heart", description: "استيكر قلب" },
    { name: "نجمة", slug: "star", description: "استيكر نجمة" },
    { name: "فراشة", slug: "butterfly", description: "استيكر فراشة" },
    { name: "شمس", slug: "sun", description: "استيكر شمس" },
  ];

  const stickers = {};
  for (const s of stickerData) {
    const created = await prisma.sticker.upsert({
      where: { slug: s.slug },
      update: { name: s.name, description: s.description },
      create: s,
    });
    stickers[s.slug] = created;
  }
  console.log("Stickers seeded:", Object.keys(stickers).length);

  // 5. Products
  const productData = [
    {
      name: "مج مخصص بالاسم",
      slug: "custom-name-mug",
      description: "مج مخصص يمكنك كتابة اسمك عليه",
      price: 250,
      categoryId: categories["mugs"].id,
      customizationEnabled: true,
      allowsName: true,
      stock: 50,
      badge: "الأكثر مبيعاً",
    },
    {
      name: "مج بثيم معين",
      slug: "themed-mug",
      description: "مج بثيم يمكنك اختياره",
      price: 280,
      oldPrice: 320,
      categoryId: categories["mugs"].id,
      customizationEnabled: true,
      allowsTheme: true,
      allowsSticker: true,
      stock: 40,
      badge: "عرض خاص",
    },
    {
      name: "مج قهوة",
      slug: "coffee-mug",
      description: "مج قهوة بتصميم أنيق",
      price: 200,
      categoryId: categories["mugs"].id,
      customizationEnabled: false,
      stock: 60,
    },
    {
      name: "تيشيرت مخصص",
      slug: "custom-tshirt",
      description: "تيشيرت مخصص بصورتك",
      price: 350,
      oldPrice: 400,
      categoryId: categories["custom-products"].id,
      customizationEnabled: true,
      allowsImageUpload: true,
      allowsNotes: true,
      stock: 30,
      badge: "جديد",
    },
    {
      name: "دفتر مخصص",
      slug: "custom-notebook",
      description: "دفتر مخصص بالاسم",
      price: 180,
      categoryId: categories["custom-products"].id,
      customizationEnabled: true,
      allowsName: true,
      stock: 45,
    },
    {
      name: "باقة استيكرز",
      slug: "sticker-pack",
      description: "باقة استيكرز متنوعة",
      price: 150,
      categoryId: categories["stickers"].id,
      customizationEnabled: false,
      stock: 100,
    },
    {
      name: "باقة استيكرز مميزة",
      slug: "premium-sticker-pack",
      description: "باقة استيكرز مميزة بتصاميم حصرية",
      price: 250,
      oldPrice: 300,
      categoryId: categories["stickers"].id,
      customizationEnabled: false,
      stock: 70,
      badge: "مميز",
    },
    {
      name: "هدية مخصصة",
      slug: "custom-gift",
      description: "هدية مخصصة بالكامل لجميع المناسبات",
      price: 500,
      oldPrice: 600,
      categoryId: categories["gifts"].id,
      customizationEnabled: true,
      allowsName: true,
      allowsTheme: true,
      allowsSticker: true,
      allowsImageUpload: true,
      allowsNotes: true,
      stock: 25,
      badge: "premium",
    },
  ];

  const products = {};
  for (const p of productData) {
    const created = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        stock: p.stock,
        badge: p.badge ?? null,
        customizationEnabled: p.customizationEnabled,
        allowsName: p.allowsName ?? false,
        allowsTheme: p.allowsTheme ?? false,
        allowsSticker: p.allowsSticker ?? false,
        allowsImageUpload: p.allowsImageUpload ?? false,
        allowsNotes: p.allowsNotes ?? false,
      },
      create: p,
    });
    products[p.slug] = created;
  }
  console.log("Products seeded:", Object.keys(products).length);

  // 6. Product-Theme associations
  const productThemeData = [
    { productSlug: "themed-mug", themeSlugs: ["space", "ocean", "forest", "city", "universe"] },
    { productSlug: "custom-gift", themeSlugs: ["space", "ocean", "forest", "city", "universe"] },
    { productSlug: "custom-name-mug", themeSlugs: ["space", "ocean"] },
  ];

  for (const { productSlug, themeSlugs } of productThemeData) {
    for (const themeSlug of themeSlugs) {
      await prisma.productTheme.upsert({
        where: {
          productId_themeId: {
            productId: products[productSlug].id,
            themeId: themes[themeSlug].id,
          },
        },
        update: {},
        create: {
          productId: products[productSlug].id,
          themeId: themes[themeSlug].id,
        },
      });
    }
  }
  console.log("Product-Theme associations seeded");

  // 7. Product-Sticker associations
  const productStickerData = [
    { productSlug: "themed-mug", stickerSlugs: ["rocket", "heart", "star", "butterfly", "sun"] },
    { productSlug: "custom-gift", stickerSlugs: ["rocket", "heart", "star", "butterfly", "sun"] },
    { productSlug: "custom-name-mug", stickerSlugs: ["heart", "star"] },
    { productSlug: "sticker-pack", stickerSlugs: ["rocket", "heart", "star", "butterfly", "sun"] },
    { productSlug: "premium-sticker-pack", stickerSlugs: ["rocket", "heart", "star", "butterfly", "sun"] },
  ];

  for (const { productSlug, stickerSlugs } of productStickerData) {
    for (const stickerSlug of stickerSlugs) {
      await prisma.productSticker.upsert({
        where: {
          productId_stickerId: {
            productId: products[productSlug].id,
            stickerId: stickers[stickerSlug].id,
          },
        },
        update: {},
        create: {
          productId: products[productSlug].id,
          stickerId: stickers[stickerSlug].id,
        },
      });
    }
  }
  console.log("Product-Sticker associations seeded");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
