import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/appError";
import type { FeaturedProductsQuery, ProductListQuery } from "./validation";

const productInclude = {
  category: true,
  images: {
    orderBy: {
      sortOrder: "asc",
    },
  },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

const toProductDto = (product: ProductWithRelations) => ({
  id: product.id,
  categoryId: product.categoryId,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: product.price.toString(),
  compareAtPrice: product.compareAtPrice?.toString() ?? null,
  sku: product.sku,
  stock: product.stock,
  isActive: product.isActive,
  isFeatured: product.isFeatured,
  category: product.category,
  images: product.images,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const buildProductWhere = (query: ProductListQuery): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { description: { contains: query.search } },
      { sku: { contains: query.search } },
    ];
  }

  if (query.category) {
    where.category = {
      slug: query.category,
    };
  }

  if (query.featured !== undefined) {
    where.isFeatured = query.featured;
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {
      gte: query.minPrice,
      lte: query.maxPrice,
    };
  }

  return where;
};

export const productService = {
  async listCategories() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  },

  async listProducts(query: ProductListQuery) {
    const where = buildProductWhere(query);
    const skip = (query.page - 1) * query.limit;

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: products.map(toProductDto),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async getFeaturedProducts(query: FeaturedProductsQuery) {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: productInclude,
      orderBy: { createdAt: "desc" },
      take: query.limit,
    });

    return products.map(toProductDto);
  },

  async getProductDetails(productId: string) {
    const product = await prisma.product.findFirst({
      where: {
        isActive: true,
        OR: [{ id: productId }, { slug: productId }],
      },
      include: productInclude,
    });

    if (!product) {
      throw new AppError("Product was not found", 404, "PRODUCT_NOT_FOUND");
    }

    return toProductDto(product);
  },
};
