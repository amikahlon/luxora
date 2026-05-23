import { PaymentStatus } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/appError";
import type { CheckoutInput } from "./validation";

export const checkoutService = {
  async createOrder(userId: string, input: CheckoutInput) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400, "CHECKOUT_EMPTY_CART");
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new AppError(`${item.product.name} is no longer available`, 409, "CHECKOUT_PRODUCT_INACTIVE");
      }

      if (item.quantity > item.product.stock) {
        throw new AppError(`${item.product.name} has insufficient stock`, 409, "CHECKOUT_STOCK_LIMIT");
      }
    }

    const totalAmount = cart.items.reduce(
      (total, item) => total + Number(item.product.price) * item.quantity,
      0,
    );

    const order = await prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          userId,
          ...input.address,
        },
      });

      const createdOrder = await tx.order.create({
        data: {
          userId,
          shippingAddressId: address.id,
          paymentMethod: input.paymentMethod,
          paymentStatus: PaymentStatus.PAID,
          totalAmount: totalAmount.toFixed(2),
          items: {
            create: cart.items.map((item) => {
              const unitPrice = Number(item.product.price);

              return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: unitPrice.toFixed(2),
                totalPrice: (unitPrice * item.quantity).toFixed(2),
              };
            }),
          },
        },
        include: {
          shippingAddress: true,
          items: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: { sortOrder: "asc" },
                  },
                },
              },
            },
          },
        },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return createdOrder;
    });

    return {
      ...order,
      totalAmount: order.totalAmount.toString(),
      items: order.items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toString(),
        totalPrice: item.totalPrice.toString(),
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          images: item.product.images,
        },
      })),
    };
  },
};
