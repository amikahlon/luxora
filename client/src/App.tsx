import { Navigate, Route, Routes } from "react-router-dom";
import { AccountPage } from "./features/account/AccountPage";
import { AdminPage } from "./features/admin/AdminPage";
import { AdminRoute } from "./features/admin/AdminRoute";
import { LoginPage } from "./features/auth/LoginPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { RegisterPage } from "./features/auth/RegisterPage";
import { CartDrawer } from "./features/cart/CartDrawer";
import { CheckoutPage } from "./features/checkout/CheckoutPage";
import { CatalogPage } from "./features/products/CatalogPage";
import { ProductDetailsPage } from "./features/products/ProductDetailsPage";
import { AppShell } from "./shared/components/AppShell";

function App() {
  return (
    <>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </AppShell>
      <CartDrawer />
    </>
  );
}

export default App;
