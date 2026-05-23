import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/appError";
import type { UpdateAdminOrderInput, UpdateAdminProductInput } from "./validation";

const productInclude = {
  category: true,
  images: {
    orderBy: { sortOrder: "asc" },
  },
} satisfies Prisma.ProductInclude;

const orderInclude = {
  user: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  },
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
} satisfies Prisma.OrderInclude;

const toProductDto = (product: Prisma.ProductGetPayload<{ include: typeof productInclude }>) => ({
  ...product,
  price: product.price.toString(),
  compareAtPrice: product.compareAtPrice?.toString() ?? null,
});

const toOrderDto = (order: Prisma.OrderGetPayload<{ include: typeof orderInclude }>) => ({
  ...order,
  totalAmount: order.totalAmount.toString(),
  items: order.items.map((item) => ({
    ...item,
    unitPrice: item.unitPrice.toString(),
    totalPrice: item.totalPrice.toString(),
  })),
});

export const adminService = {
  async getSummary() {
    const [usersCount, productsCount, ordersCount, revenue, lowStockProducts, recentOrders] =
      await prisma.$transaction([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: { totalAmount: true },
        }),
        prisma.product.findMany({
          where: { stock: { lte: 5 } },
          include: productInclude,
          orderBy: { stock: "asc" },
          take: 6,
        }),
        prisma.order.findMany({
          include: orderInclude,
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
      ]);

    return {
      stats: {
        usersCount,
        productsCount,
        ordersCount,
        revenue: revenue._sum.totalAmount?.toString() ?? "0.00",
      },
      lowStockProducts: lowStockProducts.map(toProductDto),
      recentOrders: recentOrders.map(toOrderDto),
    };
  },

  async listProducts() {
    const products = await prisma.product.findMany({
      include: productInclude,
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });

    return products.map(toProductDto);
  },

  async updateProduct(productId: string, input: UpdateAdminProductInput) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new AppError("Product was not found", 404, "PRODUCT_NOT_FOUND");
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: input,
      include: productInclude,
    });

    return toProductDto(updatedProduct);
  },

  async listOrders() {
    const orders = await prisma.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });

    return orders.map(toOrderDto);
  },

  async updateOrder(orderId: string, input: UpdateAdminOrderInput) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    });

    if (!order) {
      throw new AppError("Order was not found", 404, "ORDER_NOT_FOUND");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: input.status },
      include: orderInclude,
    });

    return toOrderDto(updatedOrder);
  },
};
