import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/appError";
import { orderService } from "./service";
import type { OrderParams } from "./validation";

export const orderController = {
  listOrders: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AppError("Authentication is required", 401, "AUTH_REQUIRED");
    }

    const orders = await orderService.listOrders(req.user.id);

    res.json({
      success: true,
      data: orders,
    });
  }),

  getOrder: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AppError("Authentication is required", 401, "AUTH_REQUIRED");
    }

    const params = req.validatedParams as OrderParams;
    const order = await orderService.getOrder(req.user.id, params.orderId);

    res.json({
      success: true,
      data: order,
    });
  }),
};
