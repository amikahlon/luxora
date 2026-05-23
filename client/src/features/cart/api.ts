import { api } from "../../shared/lib/api";
import type { ApiResponse, Cart } from "../../shared/types";

export const getCart = async () => {
  const response = await api.get<ApiResponse<Cart>>("/cart");
  return response.data.data;
};

export const addCartItem = async (payload: { productId: string; quantity: number }) => {
  const response = await api.post<ApiResponse<Cart>>("/cart/items", payload);
  return response.data.data;
};

export const updateCartItem = async (payload: { itemId: string; quantity: number }) => {
  const response = await api.patch<ApiResponse<Cart>>(`/cart/items/${payload.itemId}`, {
    quantity: payload.quantity,
  });
  return response.data.data;
};

export const removeCartItem = async (itemId: string) => {
  const response = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
  return response.data.data;
};
