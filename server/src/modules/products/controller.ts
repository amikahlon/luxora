import { asyncHandler } from "../../utils/asyncHandler";
import { productService } from "./service";
import type { FeaturedProductsQuery, ProductListQuery, ProductParams } from "./validation";

export const productController = {
  listCategories: asyncHandler(async (_req, res) => {
    const categories = await productService.listCategories();

    res.json({
      success: true,
      data: categories,
    });
  }),

  listProducts: asyncHandler(async (req, res) => {
    const query = req.validatedQuery as ProductListQuery;
    const result = await productService.listProducts(query);

    res.json({
      success: true,
      data: result.items,
      meta: result.meta,
    });
  }),

  getFeaturedProducts: asyncHandler(async (req, res) => {
    const query = req.validatedQuery as FeaturedProductsQuery;
    const products = await productService.getFeaturedProducts(query);

    res.json({
      success: true,
      data: products,
    });
  }),

  getProductDetails: asyncHandler(async (req, res) => {
    const params = req.validatedParams as ProductParams;
    const product = await productService.getProductDetails(params.productId);

    res.json({
      success: true,
      data: product,
    });
  }),
};
