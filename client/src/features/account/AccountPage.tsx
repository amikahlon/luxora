import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../auth/api";
import { EmptyState } from "../../shared/components/EmptyState";
import { formatDate, formatPrice } from "../../shared/lib/format";
import { getPrimaryProductImage } from "../../shared/lib/images";
import { getOrders } from "./api";

export function AccountPage() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-md border border-luxora-gold/20 bg-luxora-ink p-6 text-white shadow-luxora">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxora-champagne">Private account</p>
        <h1 className="mt-3 font-display text-5xl leading-none">
          {user?.firstName} {user?.lastName}
        </h1>
        <p className="mt-4 text-sm text-white/62">{user?.email}</p>
        <div className="mt-8 rounded-md border border-white/12 bg-white/8 p-4">
          <p className="text-sm font-semibold text-luxora-champagne">{orders.length}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/45">Orders placed</p>
        </div>
      </aside>
      <div className="rounded-md border border-luxora-gold/20 bg-white/92 p-6 shadow-luxora backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxora-sage">Archive</p>
        <h2 className="mt-1 font-display text-4xl">Order history</h2>
        {orders.length ? (
          <div className="mt-5 space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-md border border-luxora-gold/20 bg-luxora-cream/55 p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">Order {order.id.slice(-8).toUpperCase()}</p>
                    <p className="mt-1 text-sm text-luxora-ink/60">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-luxora-sage">{order.status}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {order.items.map((item) => {
                    const primaryImage = getPrimaryProductImage(item.product.images, item.product.name);

                    return (
                      <Link
                        key={item.id}
                        to={`/products/${item.product.slug}`}
                        className="flex items-center gap-2 rounded-md border border-luxora-ink/10 bg-white/80 px-2 py-2 text-sm font-medium shadow-sm transition hover:border-luxora-gold/35"
                      >
                        <img className="h-10 w-10 rounded-md object-cover" src={primaryImage.src} alt={primaryImage.alt} />
                        {item.product.name}
                      </Link>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState title="No orders yet">
              <Link className="mt-4 inline-flex font-medium text-luxora-ink underline" to="/products">
                Browse products
              </Link>
            </EmptyState>
          </div>
        )}
      </div>
    </section>
  );
}
