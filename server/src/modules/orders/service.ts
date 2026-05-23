import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/appError";

const orderInclude = {
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
} satisfies Prisma.OrderInclude;

type OrderWithRelations = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

const toOrderDto = (order: OrderWithRelations) => ({
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
});

export const orderService = {
  async listOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });

    return orders.map(toOrderDto);
  },

  async getOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: orderInclude,
    });

    if (!order) {
      throw new AppError("Order was not found", 404, "ORDER_NOT_FOUND");
    }

    return toOrderDto(order);
  },
};
