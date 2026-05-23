import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { orderController } from "./controller";
import { orderParamsSchema } from "./validation";

export const orderRoutes = Router();

orderRoutes.use(requireAuth);
orderRoutes.get("/", orderController.listOrders);
orderRoutes.get("/:orderId", validateRequest({ params: orderParamsSchema }), orderController.getOrder);
