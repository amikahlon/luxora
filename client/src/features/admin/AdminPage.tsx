import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Boxes, Crown, PackageCheck, Star, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "../../shared/components/EmptyState";
import { formatDate, formatPrice } from "../../shared/lib/format";
import { getPrimaryProductImage } from "../../shared/lib/images";
import type { Product } from "../../shared/types";
import {
  getAdminOrders,
  getAdminProducts,
  getAdminSummary,
  updateAdminOrderStatus,
  updateAdminProduct,
  type AdminOrder,
} from "./api";

const orderStatuses: AdminOrder["status"][] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

type StockInputProps = {
  product: Product;
  isDisabled: boolean;
  onSave: (stock: number) => void;
};

function StockInput({ product, isDisabled, onSave }: StockInputProps) {
  const [stockValue, setStockValue] = useState(String(product.stock));

  useEffect(() => {
    setStockValue(String(product.stock));
  }, [product.stock]);

  return (
    <input
      className="h-9 w-20 rounded-md border border-luxora-ink/15 bg-white px-2 text-sm outline-none transition focus:border-luxora-gold focus:ring-2 focus:ring-luxora-gold/20 disabled:bg-luxora-mist"
      type="number"
      min={0}
      value={stockValue}
      disabled={isDisabled}
      onChange={(event) => setStockValue(event.target.value)}
      onBlur={() => {
        const nextStock = Number(stockValue);

        if (Number.isInteger(nextStock) && nextStock >= 0 && nextStock !== product.stock) {
          onSave(nextStock);
        } else {
          setStockValue(String(product.stock));
        }
      }}
    />
  );
}

export function AdminPage() {
  const queryClient = useQueryClient();
  const { data: summary } = useQuery({
    queryKey: ["admin-summary"],
    queryFn: getAdminSummary,
  });
  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAdminProducts,
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  });

  const productMutation = useMutation({
    mutationFn: updateAdminProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-summary"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["featured-products"] });
    },
  });

  const orderMutation = useMutation({
    mutationFn: updateAdminOrderStatus,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-summary"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const stats = [
    {
      label: "Revenue",
      value: formatPrice(summary?.stats.revenue ?? "0"),
      icon: Crown,
    },
    {
      label: "Orders",
      value: String(summary?.stats.ordersCount ?? 0),
      icon: PackageCheck,
    },
    {
      label: "Products",
      value: String(summary?.stats.productsCount ?? 0),
      icon: Boxes,
    },
    {
      label: "Customers",
      value: String(summary?.stats.usersCount ?? 0),
      icon: UsersRound,
    },
  ];

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-md border border-luxora-gold/25 bg-luxora-ink p-6 text-white shadow-luxora sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-luxora-champagne">Admin atelier</p>
        <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="font-display text-6xl leading-none">Control room</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">
              Manage product visibility, stock posture and order status from the LUXORA operations surface.
            </p>
          </div>
          <div className="rounded-md border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/72">
            Protected by ADMIN role
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="rounded-md border border-luxora-gold/20 bg-white/92 p-5 shadow-sm backdrop-blur">
              <Icon className="text-luxora-gold" size={20} />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-luxora-sage">{stat.label}</p>
              <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-md border border-luxora-gold/20 bg-white/92 p-5 shadow-luxora backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-luxora-sage">Merchandising</p>
              <h2 className="mt-1 font-display text-4xl">Products</h2>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-luxora-ink/10 text-xs uppercase tracking-[0.16em] text-luxora-ink/45">
                <tr>
                  <th className="py-3">Product</th>
                  <th className="py-3">Stock</th>
                  <th className="py-3">Active</th>
                  <th className="py-3">Featured</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxora-ink/8">
                {products.map((product) => {
                  const primaryImage = getPrimaryProductImage(product.images, product.name);

                  return (
                    <tr key={product.id}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="h-12 w-12 rounded-md object-cover"
                            src={primaryImage.src}
                            alt={primaryImage.alt}
                          />
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-xs text-luxora-ink/50">{formatPrice(product.price)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <StockInput
                          product={product}
                          isDisabled={productMutation.isPending}
                          onSave={(stock) => productMutation.mutate({ productId: product.id, stock })}
                        />
                      </td>
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={product.isActive}
                          onChange={(event) =>
                            productMutation.mutate({ productId: product.id, isActive: event.target.checked })
                          }
                        />
                      </td>
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={product.isFeatured}
                          onChange={(event) =>
                            productMutation.mutate({ productId: product.id, isFeatured: event.target.checked })
                          }
                        />
                      </td>
                      <td className="py-4 text-right">
                        {product.stock <= 5 ? (
                          <span className="inline-flex rounded-md bg-luxora-wine/10 px-2 py-1 text-xs font-semibold text-luxora-wine">
                            Low stock
                          </span>
                        ) : (
                          <span className="text-xs text-luxora-ink/45">Healthy</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-md border border-luxora-gold/20 bg-white/92 p-5 shadow-luxora backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-luxora-sage">Operations</p>
          <h2 className="mt-1 font-display text-4xl">Orders</h2>
          {orders.length ? (
            <div className="mt-5 space-y-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-md border border-luxora-ink/10 bg-luxora-cream/60 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">Order {order.id.slice(-8).toUpperCase()}</p>
                      <p className="mt-1 text-xs text-luxora-ink/50">
                        {order.user.firstName} {order.user.lastName} - {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <select
                      className="h-10 rounded-md border border-luxora-ink/15 bg-white px-3 text-sm font-medium"
                      value={order.status}
                      onChange={(event) =>
                        orderMutation.mutate({
                          orderId: order.id,
                          status: event.target.value as AdminOrder["status"],
                        })
                      }
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-luxora-sage">
                      <Star size={13} />
                      {order.paymentStatus}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState title="No orders yet" />
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
