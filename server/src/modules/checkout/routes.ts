import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkoutController } from "./controller";
import { checkoutSchema } from "./validation";

export const checkoutRoutes = Router();

checkoutRoutes.post("/", requireAuth, validateRequest({ body: checkoutSchema }), checkoutController.createOrder);
