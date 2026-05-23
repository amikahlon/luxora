import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { productController } from "./controller";
import {
  featuredProductsQuerySchema,
  productListQuerySchema,
  productParamsSchema,
} from "./validation";

export const productRoutes = Router();

productRoutes.get("/categories", productController.listCategories);

productRoutes.get(
  "/",
  validateRequest({ query: productListQuerySchema }),
  productController.listProducts,
);

productRoutes.get(
  "/featured",
  validateRequest({ query: featuredProductsQuerySchema }),
  productController.getFeaturedProducts,
);

productRoutes.get(
  "/:productId",
  validateRequest({ params: productParamsSchema }),
  productController.getProductDetails,
);
