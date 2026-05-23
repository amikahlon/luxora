import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { cartController } from "./controller";
import { addCartItemSchema, cartItemParamsSchema, updateCartItemSchema } from "./validation";

export const cartRoutes = Router();

cartRoutes.use(requireAuth);
cartRoutes.get("/", cartController.getCart);
cartRoutes.post("/items", validateRequest({ body: addCartItemSchema }), cartController.addItem);
cartRoutes.patch(
  "/items/:itemId",
  validateRequest({ params: cartItemParamsSchema, body: updateCartItemSchema }),
  cartController.updateItem,
);
cartRoutes.delete(
  "/items/:itemId",
  validateRequest({ params: cartItemParamsSchema }),
  cartController.removeItem,
);
