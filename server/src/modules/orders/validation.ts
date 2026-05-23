import { z } from "zod";

export const orderParamsSchema = z.object({
  orderId: z.string().trim().min(1),
});

export type OrderParams = z.infer<typeof orderParamsSchema>;
