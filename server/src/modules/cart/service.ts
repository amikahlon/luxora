import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/appError";
import type { AddCartItemInput, UpdateCartItemInput } from "./validation";

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  },
} satisfies Prisma.CartInclude;

type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

const toCartDto = (cart: CartWithItems) => {
  const items = cart.items.map((item) => {
    const unitPrice = Number(item.product.price);
    const lineTotal = unitPrice * item.quantity;

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.product.price.toString(),
      lineTotal: lineTotal.toFixed(2),
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price.toString(),
        stock: item.product.stock,
        category: item.product.category,
        images: item.product.images,
      },
    };
  });

  const totalAmount = items.reduce((total, item) => total + Number(item.lineTotal), 0);
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    summary: {
      totalAmount: totalAmount.toFixed(2),
      totalQuantity,
    },
  };
};

const getOrCreateCart = async (userId: string) => {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: cartInclude,
  });
};

export const cartService = {
  async getCart(userId: string) {
    const cart = await getOrCreateCart(userId);
    return toCartDto(cart);
  },

  async addItem(userId: string, input: AddCartItemInput) {
    const product = await prisma.product.findFirst({
      where: {
        id: input.productId,
        isActive: true,
      },
      select: { id: true, stock: true },
    });

    if (!product) {
      throw new AppError("Product was not found", 404, "PRODUCT_NOT_FOUND");
    }

    const cart = await getOrCreateCart(userId);
    const existingItem = cart.items.find((item) => item.productId === input.productId);
    const nextQuantity = (existingItem?.quantity ?? 0) + input.quantity;

    if (nextQuantity > product.stock) {
      throw new AppError("Requested quantity exceeds available stock", 409, "CART_STOCK_LIMIT");
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: input.productId,
        },
      },
      update: { quantity: nextQuantity },
      create: {
        cartId: cart.id,
        productId: input.productId,
        quantity: input.quantity,
      },
    });

    return this.getCart(userId);
  },

  async updateItem(userId: string, itemId: string, input: UpdateCartItemInput) {
    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: {
        product: {
          select: { stock: true },
        },
      },
    });

    if (!item) {
      throw new AppError("Cart item was not found", 404, "CART_ITEM_NOT_FOUND");
    }

    if (input.quantity > item.product.stock) {
      throw new AppError("Requested quantity exceeds available stock", 409, "CART_STOCK_LIMIT");
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: input.quantity },
    });

    return this.getCart(userId);
  },

  async removeItem(userId: string, itemId: string) {
    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      select: { id: true },
    });

    if (!item) {
      throw new AppError("Cart item was not found", 404, "CART_ITEM_NOT_FOUND");
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  },
};
