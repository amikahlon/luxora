import { Role } from "@prisma/client";
import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminController } from "./controller";
import {
  adminOrderParamsSchema,
  adminProductParamsSchema,
  updateAdminOrderSchema,
  updateAdminProductSchema,
} from "./validation";

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireRole(Role.ADMIN));

adminRoutes.get("/summary", adminController.summary);
adminRoutes.get("/products", adminController.listProducts);
adminRoutes.patch(
  "/products/:productId",
  validateRequest({ params: adminProductParamsSchema, body: updateAdminProductSchema }),
  adminController.updateProduct,
);
adminRoutes.get("/orders", adminController.listOrders);
adminRoutes.patch(
  "/orders/:orderId",
  validateRequest({ params: adminOrderParamsSchema, body: updateAdminOrderSchema }),
  adminController.updateOrder,
);
