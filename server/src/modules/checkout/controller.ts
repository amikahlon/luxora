import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/appError";
import { checkoutService } from "./service";
import type { CheckoutInput } from "./validation";

export const checkoutController = {
  createOrder: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AppError("Authentication is required", 401, "AUTH_REQUIRED");
    }

    const order = await checkoutService.createOrder(req.user.id, req.validatedBody as CheckoutInput);

    res.status(201).json({
      success: true,
      data: order,
    });
  }),
};
