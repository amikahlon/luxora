import { api } from "../../shared/lib/api";
import type { ApiResponse, Order } from "../../shared/types";

export type CheckoutPayload = {
  address: {
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  };
  paymentMethod: "card" | "paypal" | "bank-transfer";
};

export const createOrder = async (payload: CheckoutPayload) => {
  const response = await api.post<ApiResponse<Order>>("/checkout", payload);
  return response.data.data;
};
