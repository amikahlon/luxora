import { api } from "../../shared/lib/api";
import type { ApiResponse, OrderStatus, PaymentStatus, Product } from "../../shared/types";

export type AdminOrder = {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    product: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
};

export type AdminSummary = {
  stats: {
    usersCount: number;
    productsCount: number;
    ordersCount: number;
    revenue: string;
  };
  lowStockProducts: Product[];
  recentOrders: AdminOrder[];
};

export const getAdminSummary = async () => {
  const response = await api.get<ApiResponse<AdminSummary>>("/admin/summary");
  return response.data.data;
};

export const getAdminProducts = async () => {
  const response = await api.get<ApiResponse<Product[]>>("/admin/products");
  return response.data.data;
};

export const updateAdminProduct = async (payload: {
  productId: string;
  stock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}) => {
  const { productId, ...data } = payload;
  const response = await api.patch<ApiResponse<Product>>(`/admin/products/${productId}`, data);
  return response.data.data;
};

export const getAdminOrders = async () => {
  const response = await api.get<ApiResponse<AdminOrder[]>>("/admin/orders");
  return response.data.data;
};

export const updateAdminOrderStatus = async (payload: {
  orderId: string;
  status: AdminOrder["status"];
}) => {
  const response = await api.patch<ApiResponse<AdminOrder>>(`/admin/orders/${payload.orderId}`, {
    status: payload.status,
  });
  return response.data.data;
};
