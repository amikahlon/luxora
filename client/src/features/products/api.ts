import { api } from "../../shared/lib/api";
import type { ApiResponse, Category, Product } from "../../shared/types";

export type ProductFilters = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: boolean;
};

export const getProducts = async (filters: ProductFilters) => {
  const response = await api.get<ApiResponse<Product[]>>("/products", {
    params: filters,
  });

  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get<ApiResponse<Product[]>>("/products/featured", {
    params: { limit: 4 },
  });

  return response.data.data;
};

export const getProduct = async (productId: string) => {
  const response = await api.get<ApiResponse<Product>>(`/products/${productId}`);
  return response.data.data;
};

export const getCategories = async () => {
  const response = await api.get<ApiResponse<Category[]>>("/products/categories");
  return response.data.data;
};
