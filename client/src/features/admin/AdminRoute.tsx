import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { accessToken, user } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/products" replace />;
  }

  return children;
}
