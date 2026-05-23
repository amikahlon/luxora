import { api } from "../../shared/lib/api";
import type { ApiResponse, Order } from "../../shared/types";

export const getOrders = async () => {
  const response = await api.get<ApiResponse<Order[]>>("/orders");
  return response.data.data;
};
