import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, PackageCheck } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../shared/components/Button";
import { EmptyState } from "../../shared/components/EmptyState";
import { Input } from "../../shared/components/Input";
import { formatPrice } from "../../shared/lib/format";
import { getPrimaryProductImage } from "../../shared/lib/images";
import { cartQueryKey, useCartQuery } from "../cart/queries";
import { createOrder, type CheckoutPayload } from "./api";

export function CheckoutPage() {
  const { data: cart } = useCartQuery(true);
  const queryClient = useQueryClient();
  const [createdOrderId, setCreatedOrderId] = useState("");
  const [form, setForm] = useState<CheckoutPayload>({
    address: {
      label: "Shipping",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      isDefault: false,
    },
    paymentMethod: "card",
  });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      setCreatedOrderId(order.id);
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const updateAddress = (field: keyof CheckoutPayload["address"], value: string | boolean) => {
    setForm((current) => ({
      ...current,
      address: {
        ...current.address,
        [field]: value,
      },
    }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate(form);
  };

  if (createdOrderId) {
    return (
      <section className="mx-auto max-w-2xl rounded-md border border-luxora-gold/25 bg-white/92 p-8 text-center shadow-luxora backdrop-blur">
        <PackageCheck className="mx-auto text-luxora-sage" size={42} />
        <h1 className="mt-4 font-display text-5xl">Order confirmed</h1>
        <p className="mt-2 text-sm text-luxora-ink/60">Your order is saved and ready in your account history.</p>
        <Link
          to="/account"
          className="mt-6 inline-flex h-10 items-center rounded-md bg-luxora-ink px-4 text-sm font-semibold text-white shadow-glow"
        >
          View orders
        </Link>
      </section>
    );
  }

  if (!cart?.items.length) {
    return (
      <EmptyState title="Your cart is empty">
        <Link className="mt-4 inline-flex font-medium text-luxora-ink underline" to="/products">
          Return to catalog
        </Link>
      </EmptyState>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <form onSubmit={onSubmit} className="rounded-md border border-luxora-gold/20 bg-white/92 p-6 shadow-luxora backdrop-blur lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxora-sage">Secure checkout</p>
        <h1 className="mt-2 font-display text-5xl">Complete the reservation</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium sm:col-span-2">
            Street
            <Input className="mt-2" value={form.address.street} onChange={(event) => updateAddress("street", event.target.value)} required />
          </label>
          <label className="block text-sm font-medium">
            City
            <Input className="mt-2" value={form.address.city} onChange={(event) => updateAddress("city", event.target.value)} required />
          </label>
          <label className="block text-sm font-medium">
            State
            <Input className="mt-2" value={form.address.state} onChange={(event) => updateAddress("state", event.target.value)} required />
          </label>
          <label className="block text-sm font-medium">
            Zip code
            <Input className="mt-2" value={form.address.zipCode} onChange={(event) => updateAddress("zipCode", event.target.value)} required />
          </label>
          <label className="block text-sm font-medium">
            Country
            <Input className="mt-2" value={form.address.country} onChange={(event) => updateAddress("country", event.target.value)} required />
          </label>
        </div>
        <div className="mt-6">
          <p className="text-sm font-semibold">Payment</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {(["card", "paypal", "bank-transfer"] as const).map((method) => (
              <label key={method} className="flex h-11 items-center gap-2 rounded-md border border-luxora-gold/25 bg-luxora-cream/60 px-3 text-sm font-medium">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === method}
                  onChange={() => setForm((current) => ({ ...current, paymentMethod: method }))}
                />
                {method}
              </label>
            ))}
          </div>
        </div>
        {mutation.isError ? (
          <p className="mt-4 rounded-md bg-luxora-wine/10 px-3 py-2 text-sm text-luxora-wine">
            Checkout failed. Please review your cart and try again.
          </p>
        ) : null}
        <Button className="mt-6 w-full" type="submit" disabled={mutation.isPending}>
          <CreditCard size={18} />
          Place order
        </Button>
      </form>
      <aside className="rounded-md border border-luxora-gold/20 bg-luxora-ink p-6 text-white shadow-luxora">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxora-champagne">Maison receipt</p>
        <h2 className="mt-2 font-display text-3xl">Order summary</h2>
        <div className="mt-4 space-y-4">
          {cart.items.map((item) => {
            const primaryImage = getPrimaryProductImage(item.product.images, item.product.name);

            return (
              <div key={item.id} className="flex gap-3">
                <img
                  className="h-16 w-14 rounded-md border border-white/10 object-cover"
                  src={primaryImage.src}
                  alt={primaryImage.alt}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{item.product.name}</p>
                  <p className="text-xs text-white/55">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-luxora-champagne">{formatPrice(item.lineTotal)}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-6 border-t border-white/12 pt-4">
          <div className="flex justify-between">
            <span className="text-white/60">Total</span>
            <strong className="text-xl text-luxora-champagne">{formatPrice(cart.summary.totalAmount)}</strong>
          </div>
        </div>
      </aside>
    </section>
  );
}
