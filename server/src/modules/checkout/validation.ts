import { z } from "zod";

export const checkoutSchema = z.object({
  address: z.object({
    label: z.string().trim().min(1).max(60).default("Shipping"),
    street: z.string().trim().min(2).max(160),
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    zipCode: z.string().trim().min(2).max(20),
    country: z.string().trim().min(2).max(80),
    isDefault: z.boolean().default(false),
  }),
  paymentMethod: z.enum(["card", "paypal", "bank-transfer"]).default("card"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
