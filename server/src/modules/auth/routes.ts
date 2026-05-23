import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { authController } from "./controller";
import { loginSchema, registerSchema } from "./validation";

export const authRoutes = Router();

authRoutes.post("/register", validateRequest({ body: registerSchema }), authController.register);
authRoutes.post("/login", validateRequest({ body: loginSchema }), authController.login);
authRoutes.get("/me", requireAuth, authController.me);
