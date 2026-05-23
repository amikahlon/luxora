import { Crown, LogOut, Menu, ShoppingBag, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore";
import { useCartDrawerStore } from "../../features/cart/cartDrawerStore";
import { useCartQuery } from "../../features/cart/queries";
import { Button } from "./Button";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, accessToken, logout } = useAuthStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const queryClient = useQueryClient();
  const openCart = useCartDrawerStore((state) => state.open);
  const { data: cart } = useCartQuery(Boolean(accessToken));
  const cartQuantity = accessToken ? cart?.summary.totalQuantity ?? 0 : 0;

  const handleLogout = () => {
    logout();
    setIsMobileNavOpen(false);
    queryClient.removeQueries({ queryKey: ["cart"] });
    queryClient.removeQueries({ queryKey: ["me"] });
    queryClient.removeQueries({ queryKey: ["orders"] });
    queryClient.removeQueries({ queryKey: ["admin-summary"] });
    queryClient.removeQueries({ queryKey: ["admin-products"] });
    queryClient.removeQueries({ queryKey: ["admin-orders"] });
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-luxora-gold/15 bg-luxora-cream shadow-header">
        <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="group flex items-center gap-3 text-luxora-ink">
            <span className="grid h-12 w-12 place-items-center rounded-md border border-luxora-gold/35 bg-white text-luxora-gold shadow-glow transition group-hover:-translate-y-0.5">
              <Crown size={22} strokeWidth={1.8} />
            </span>
            <span>
              <span className="block font-display text-[34px] leading-none tracking-normal text-luxora-ink">LUXORA</span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.38em] text-luxora-ink/42 sm:block">
                Maison commerce
              </span>
            </span>
          </Link>
          <nav className="hidden items-center rounded-md border border-luxora-gold/20 bg-white p-1.5 text-sm font-semibold text-luxora-ink/58 shadow-sm md:flex">
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-4 py-2.5 transition ${isActive ? "bg-luxora-champagne/70 text-luxora-ink shadow-sm" : "hover:bg-luxora-cream/70 hover:text-luxora-ink"}`
              }
              to="/products"
            >
              Boutique
            </NavLink>
            {accessToken ? (
              <NavLink
                className={({ isActive }) =>
                  `rounded-md px-4 py-2.5 transition ${isActive ? "bg-luxora-champagne/70 text-luxora-ink shadow-sm" : "hover:bg-luxora-cream/70 hover:text-luxora-ink"}`
                }
                to="/account"
              >
                Account
              </NavLink>
            ) : null}
            {user?.role === "ADMIN" ? (
              <NavLink
                className={({ isActive }) =>
                  `rounded-md px-4 py-2.5 transition ${isActive ? "bg-luxora-champagne/70 text-luxora-ink shadow-sm" : "hover:bg-luxora-cream/70 hover:text-luxora-ink"}`
                }
                to="/admin"
              >
                Admin
              </NavLink>
            ) : null}
          </nav>
          <div className="flex items-center gap-2.5">
            <button
              aria-label="Open cart"
              title="Open cart"
              className="relative grid h-12 w-12 place-items-center rounded-md border border-luxora-gold/30 bg-white/90 text-luxora-ink shadow-sm transition hover:-translate-y-0.5 hover:border-luxora-gold hover:bg-luxora-champagne/25 hover:shadow-glow"
              onClick={openCart}
              type="button"
            >
              <ShoppingBag size={25} strokeWidth={1.9} />
              {cartQuantity ? (
                <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full border-2 border-luxora-cream bg-luxora-wine px-1 text-[11px] font-bold leading-none text-white shadow-sm">
                  {cartQuantity}
                </span>
              ) : null}
            </button>
            {accessToken ? (
              <>
                <Link to="/account" className="hidden h-12 items-center gap-2 rounded-md border border-luxora-gold/25 bg-white px-4 text-sm font-semibold text-luxora-ink shadow-sm transition hover:border-luxora-gold/45 sm:inline-flex">
                  <UserRound size={17} />
                  {user?.firstName ?? "Account"}
                </Link>
                <Button aria-label="Log out" title="Log out" variant="ghost" className="h-12 w-12 px-0" onClick={handleLogout}>
                  <LogOut size={19} />
                </Button>
              </>
            ) : (
              <>
                <Link to="/register" className="hidden h-12 items-center rounded-md border border-luxora-gold/35 bg-white px-4 text-sm font-semibold text-luxora-ink shadow-sm transition hover:border-luxora-gold hover:bg-luxora-champagne/30 sm:inline-flex">
                  Create account
                </Link>
                <Link to="/login" className="inline-flex h-12 items-center rounded-md bg-luxora-ink px-5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-luxora-charcoal">
                  Sign in
                </Link>
              </>
            )}
            <Button
              aria-label="Menu"
              title="Menu"
              variant="ghost"
              className="h-12 w-12 px-0 md:hidden"
              onClick={() => setIsMobileNavOpen((current) => !current)}
            >
              <Menu size={22} />
            </Button>
          </div>
        </div>
        {isMobileNavOpen ? (
          <div className="border-t border-luxora-gold/20 bg-luxora-cream px-4 py-4 shadow-sm md:hidden">
            <div className="grid gap-2">
              <Link className="rounded-md px-3 py-2 text-sm font-semibold text-luxora-ink hover:bg-luxora-champagne/35" to="/products" onClick={() => setIsMobileNavOpen(false)}>
                Boutique
              </Link>
              {accessToken ? (
                <Link className="rounded-md px-3 py-2 text-sm font-semibold text-luxora-ink hover:bg-luxora-champagne/35" to="/account" onClick={() => setIsMobileNavOpen(false)}>
                  Account
                </Link>
              ) : null}
              {user?.role === "ADMIN" ? (
                <Link className="rounded-md px-3 py-2 text-sm font-semibold text-luxora-ink hover:bg-luxora-champagne/35" to="/admin" onClick={() => setIsMobileNavOpen(false)}>
                  Admin
                </Link>
              ) : null}
              {!accessToken ? (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link className="inline-flex h-10 items-center justify-center rounded-md border border-luxora-gold/45 bg-luxora-champagne/55 text-sm font-semibold text-luxora-ink" to="/register" onClick={() => setIsMobileNavOpen(false)}>
                    Create account
                  </Link>
                  <Link className="inline-flex h-10 items-center justify-center rounded-md bg-luxora-ink text-sm font-semibold text-white" to="/login" onClick={() => setIsMobileNavOpen(false)}>
                    Sign in
                  </Link>
                </div>
              ) : (
                <Button variant="secondary" className="mt-2 justify-start" onClick={handleLogout}>
                  <LogOut size={16} />
                  Log out
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
