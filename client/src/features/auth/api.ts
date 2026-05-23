import { api } from "../../shared/lib/api";
import type { ApiResponse, User } from "../../shared/types";

type AuthPayload = {
  user: User;
  accessToken: string;
};

export const login = async (payload: { email: string; password: string }) => {
  const response = await api.post<ApiResponse<AuthPayload>>("/auth/login", payload);
  return response.data.data;
};

export const register = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await api.post<ApiResponse<AuthPayload>>("/auth/register", payload);
  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");
  return response.data.data.user;
};
