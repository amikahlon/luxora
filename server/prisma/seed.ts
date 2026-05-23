import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/prisma/client";

const PASSWORD_SALT_ROUNDS = 12;

async function seedUser() {
  const passwordHash = await bcrypt.hash("Password123!", PASSWORD_SALT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email: "demo@luxora.dev" },
    update: {
      firstName: "Demo",
      lastName: "Customer",
      role: Role.USER,
    },
    create: {
      email: "demo@luxora.dev",
      passwordHash,
      firstName: "Demo",
      lastName: "Customer",
      role: Role.USER,
    },
  });

  await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  return user;
}

async function seedAdminUser() {
  const passwordHash = await bcrypt.hash("Admin123!", PASSWORD_SALT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email: "admin@luxora.dev" },
    update: {
      firstName: "Admin",
      lastName: "Maison",
      role: Role.ADMIN,
    },
    create: {
      email: "admin@luxora.dev",
      passwordHash,
      firstName: "Admin",
      lastName: "Maison",
      role: Role.ADMIN,
    },
  });

  await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  return user;
}

async function seedCatalog() {
  const categories = [
    {
      name: "Timepieces",
      slug: "timepieces",
      description: "Precision watches crafted for understated luxury.",
      imageUrl:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Fragrance",
      slug: "fragrance",
      description: "Signature scents with refined, lasting character.",
      imageUrl:
        "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Leather Goods",
      slug: "leather-goods",
      description: "Elegant everyday pieces made from premium leather.",
      imageUrl:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const categoryBySlug = new Map<string, string>();

  for (const category of categories) {
    const savedCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });

    categoryBySlug.set(savedCategory.slug, savedCategory.id);
  }

  const products = [
    {
      categorySlug: "timepieces",
      name: "Aurelian Slim Watch",
      slug: "aurelian-slim-watch",
      description:
        "A polished stainless steel dress watch with a sapphire crystal face and Italian leather strap.",
      price: "1290.00",
      compareAtPrice: "1490.00",
      sku: "LUX-WAT-001",
      stock: 18,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80",
          altText: "Aurelian Slim Watch on marble",
        },
      ],
    },
    {
      categorySlug: "fragrance",
      name: "Nocturne Eau de Parfum",
      slug: "nocturne-eau-de-parfum",
      description:
        "A warm blend of cedar, amber, and black tea designed for evening wear.",
      price: "185.00",
      compareAtPrice: null,
      sku: "LUX-FRA-001",
      stock: 42,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1200&q=80",
          altText: "Nocturne perfume bottle",
        },
      ],
    },
    {
      categorySlug: "leather-goods",
      name: "Sienna Structured Tote",
      slug: "sienna-structured-tote",
      description:
        "A structured full-grain leather tote with a suede-lined interior and brass hardware.",
      price: "640.00",
      compareAtPrice: "720.00",
      sku: "LUX-BAG-001",
      stock: 12,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=80",
          altText: "Sienna leather tote",
        },
      ],
    },
    {
      categorySlug: "fragrance",
      name: "Solstice Candle",
      slug: "solstice-candle",
      description:
        "Hand-poured wax with neroli, fig leaf, and white musk in a smoked glass vessel.",
      price: "74.00",
      compareAtPrice: null,
      sku: "LUX-HOM-001",
      stock: 55,
      isFeatured: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
          altText: "Solstice scented candle",
        },
      ],
    },
  ];

  for (const product of products) {
    const categoryId = categoryBySlug.get(product.categorySlug);

    if (!categoryId) {
      throw new Error(`Missing category for product ${product.sku}`);
    }

    const savedProduct = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        categoryId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        isActive: true,
        isFeatured: product.isFeatured,
      },
      create: {
        categoryId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        sku: product.sku,
        stock: product.stock,
        isActive: true,
        isFeatured: product.isFeatured,
      },
    });

    await prisma.productImage.deleteMany({
      where: { productId: savedProduct.id },
    });

    await prisma.productImage.createMany({
      data: product.images.map((image, index) => ({
        productId: savedProduct.id,
        url: image.url,
        altText: image.altText,
        sortOrder: index,
      })),
    });
  }
}

async function main() {
  await seedUser();
  await seedAdminUser();
  await seedCatalog();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
