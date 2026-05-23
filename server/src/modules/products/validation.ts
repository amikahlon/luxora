import { z } from "zod";

const booleanQuerySchema = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();

export const productListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(12),
    search: z.string().trim().min(1).max(120).optional(),
    category: z.string().trim().min(1).max(120).optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    featured: booleanQuerySchema,
  })
  .refine(
    (query) =>
      query.minPrice === undefined ||
      query.maxPrice === undefined ||
      query.minPrice <= query.maxPrice,
    {
      message: "minPrice must be less than or equal to maxPrice",
      path: ["minPrice"],
    },
  );

export const featuredProductsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(24).default(8),
});

export const productParamsSchema = z.object({
  productId: z.string().trim().min(1),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type FeaturedProductsQuery = z.infer<typeof featuredProductsQuerySchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;
