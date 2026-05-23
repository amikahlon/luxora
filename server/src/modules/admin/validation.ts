import { OrderStatus } from "@prisma/client";
import { z } from "zod";

export const adminProductParamsSchema = z.object({
  productId: z.string().trim().min(1),
});

export const adminOrderParamsSchema = z.object({
  orderId: z.string().trim().min(1),
});

export const updateAdminProductSchema = z
  .object({
    stock: z.coerce.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one product field is required",
  });

export const updateAdminOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export type AdminProductParams = z.infer<typeof adminProductParamsSchema>;
export type AdminOrderParams = z.infer<typeof adminOrderParamsSchema>;
export type UpdateAdminProductInput = z.infer<typeof updateAdminProductSchema>;
export type UpdateAdminOrderInput = z.infer<typeof updateAdminOrderSchema>;
