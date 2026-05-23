import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";
import { Button } from "../../shared/components/Button";
import { EmptyState } from "../../shared/components/EmptyState";
import { formatPrice } from "../../shared/lib/format";
import { getPrimaryProductImage } from "../../shared/lib/images";
import { useCartDrawerStore } from "./cartDrawerStore";
import { useCartQuery, useRemoveCartItemMutation, useUpdateCartItemMutation } from "./queries";

export function CartDrawer() {
  const isOpen = useCartDrawerStore((state) => state.isOpen);
  const close = useCartDrawerStore((state) => state.close);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: cart } = useCartQuery(isOpen && Boolean(accessToken));
  const updateItem = useUpdateCartItemMutation();
  const removeItem = useRemoveCartItemMutation();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close cart overlay" className="absolute inset-0 bg-luxora-ink/55 backdrop-blur-sm" onClick={close} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-luxora-gold/25 bg-luxora-cream shadow-2xl">
        <div className="flex h-20 items-center justify-between border-b border-luxora-gold/20 bg-white/70 px-5 backdrop-blur">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <ShoppingBag size={18} className="text-luxora-gold" />
              Private cart
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-luxora-ink/45">Reserved selections</p>
          </div>
          <Button aria-label="Close cart" title="Close cart" variant="ghost" className="h-10 w-10 px-0" onClick={close}>
            <X size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {!accessToken ? (
            <EmptyState title="Sign in to use your cart">
              <Link className="mt-4 inline-flex font-medium text-luxora-ink underline" to="/login" onClick={close}>
                Sign in
              </Link>
            </EmptyState>
          ) : !cart?.items.length ? (
            <EmptyState title="Your cart is empty" />
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => {
                const primaryImage = getPrimaryProductImage(item.product.images, item.product.name);

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[88px_1fr] gap-4 rounded-md border border-luxora-gold/25 bg-white/92 p-3 shadow-sm"
                  >
                    <img
                      className="h-28 w-full rounded-md border border-luxora-ink/5 object-cover shadow-sm"
                      src={primaryImage.src}
                      alt={primaryImage.alt}
                    />
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold leading-snug">{item.product.name}</p>
                          <p className="text-sm text-luxora-ink/60">{formatPrice(item.unitPrice)}</p>
                        </div>
                        <span className="rounded-md bg-luxora-champagne/45 px-2 py-1 text-xs font-semibold text-luxora-ink">
                          {formatPrice(item.lineTotal)}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-md border border-luxora-gold/30 bg-luxora-cream/80 p-1 shadow-sm">
                          <button
                            aria-label="Decrease quantity"
                            title="Decrease quantity"
                            className="grid h-9 w-9 place-items-center rounded-md text-luxora-ink transition hover:bg-white disabled:text-luxora-ink/25"
                            disabled={item.quantity <= 1}
                            onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                          >
                            <Minus size={17} strokeWidth={2.4} />
                          </button>
                          <span className="grid h-9 min-w-11 place-items-center rounded-md bg-white px-3 text-sm font-bold text-luxora-ink shadow-sm">
                            {item.quantity}
                          </span>
                          <button
                            aria-label="Increase quantity"
                            title="Increase quantity"
                            className="grid h-9 w-9 place-items-center rounded-md text-luxora-ink transition hover:bg-white disabled:text-luxora-ink/25"
                            disabled={item.quantity >= item.product.stock}
                            onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                          >
                            <Plus size={17} strokeWidth={2.4} />
                          </button>
                        </div>
                        <button
                          className="inline-flex h-9 items-center gap-2 rounded-md border border-luxora-wine/20 bg-luxora-wine/8 px-3 text-sm font-semibold text-luxora-wine transition hover:bg-luxora-wine hover:text-white"
                          onClick={() => removeItem.mutate(item.id)}
                          type="button"
                        >
                          <Trash2 size={15} strokeWidth={2.3} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {accessToken && cart?.items.length ? (
          <div className="border-t border-luxora-gold/20 bg-white/78 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-sm">
              <span className="text-luxora-ink/60">Subtotal</span>
              <strong className="text-lg">{formatPrice(cart.summary.totalAmount)}</strong>
            </div>
            <Link
              to="/checkout"
              onClick={close}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-luxora-ink text-sm font-semibold text-white shadow-glow transition hover:bg-luxora-charcoal"
            >
              Checkout
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
