import { asyncHandler } from "../../utils/asyncHandler";
import { adminService } from "./service";
import type {
  AdminOrderParams,
  AdminProductParams,
  UpdateAdminOrderInput,
  UpdateAdminProductInput,
} from "./validation";

export const adminController = {
  summary: asyncHandler(async (_req, res) => {
    const summary = await adminService.getSummary();

    res.json({
      success: true,
      data: summary,
    });
  }),

  listProducts: asyncHandler(async (_req, res) => {
    const products = await adminService.listProducts();

    res.json({
      success: true,
      data: products,
    });
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const params = req.validatedParams as AdminProductParams;
    const product = await adminService.updateProduct(
      params.productId,
      req.validatedBody as UpdateAdminProductInput,
    );

    res.json({
      success: true,
      data: product,
    });
  }),

  listOrders: asyncHandler(async (_req, res) => {
    const orders = await adminService.listOrders();

    res.json({
      success: true,
      data: orders,
    });
  }),

  updateOrder: asyncHandler(async (req, res) => {
    const params = req.validatedParams as AdminOrderParams;
    const order = await adminService.updateOrder(
      params.orderId,
      req.validatedBody as UpdateAdminOrderInput,
    );

    res.json({
      success: true,
      data: order,
    });
  }),
};
