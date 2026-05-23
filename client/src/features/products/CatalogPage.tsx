import { useQuery } from "@tanstack/react-query";
import { Gem, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "../../shared/components/EmptyState";
import { Input } from "../../shared/components/Input";
import { getPrimaryProductImage } from "../../shared/lib/images";
import { getCategories, getFeaturedProducts, getProducts } from "./api";
import { ProductCard } from "./ProductCard";

export function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filters = useMemo(
    () => ({
      page: 1,
      limit: 12,
      search: search || undefined,
      category: category || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    }),
    [category, maxPrice, minPrice, search],
  );

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: featured = [] } = useQuery({
    queryKey: ["featured-products"],
    queryFn: getFeaturedProducts,
  });

  const products = productsResponse?.data ?? [];

  return (
    <div className="space-y-10">
      <section className="relative min-h-[520px] overflow-hidden rounded-md border border-luxora-gold/25 bg-luxora-ink shadow-luxora">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1800&q=85"
          alt="Luxury accessories arranged on a dark surface"
        />
        <div className="absolute inset-0 bg-luxora-ink/55" />
        <div className="relative flex min-h-[520px] flex-col justify-end p-6 text-white sm:p-10 lg:p-12">
          <div className="mb-8 flex w-fit items-center gap-2 rounded-md border border-luxora-gold/35 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-luxora-champagne backdrop-blur">
            <Sparkles size={14} />
            Private seasonal edit
          </div>
          <h1 className="max-w-4xl font-display text-6xl leading-[0.92] text-white sm:text-7xl lg:text-8xl">
            Modern luxury, curated with restraint.
          </h1>
          <div className="mt-6 grid max-w-5xl gap-5 lg:grid-cols-[1fr_320px]">
            <p className="max-w-2xl text-base leading-7 text-white/78">
              Discover sculptural timepieces, fragrance, leather goods and home objects selected for quiet presence, tactile materials and lasting detail.
            </p>
            <div className="rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-luxora-champagne">
                <Gem size={18} />
                <span className="text-sm font-semibold uppercase tracking-[0.18em]">Concierge ready</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/72">Signed-in members can reserve pieces, checkout securely and review orders from a private account space.</p>
            </div>
          </div>
        </div>
      </section>

      {featured.length ? (
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxora-sage">Featured</p>
              <h2 className="mt-1 font-display text-3xl">Objects of attention</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 2).map((product) => {
              const primaryImage = getPrimaryProductImage(product.images, product.name);

              return (
                <div
                  key={product.id}
                  className="group relative min-h-64 overflow-hidden rounded-md border border-luxora-gold/25 bg-luxora-ink shadow-sm"
                >
                  <img
                    className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
                    src={primaryImage.src}
                    alt={primaryImage.alt}
                  />
                  <div className="absolute inset-0 bg-luxora-ink/45" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-luxora-champagne">{product.category.name}</p>
                    <p className="mt-2 text-xl font-semibold">{product.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="rounded-md border border-luxora-gold/20 bg-white/88 p-4 shadow-luxora backdrop-blur">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_120px_120px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-luxora-ink/40" size={18} />
            <Input className="pl-10" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <label className="relative block">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-luxora-ink/40" size={17} />
            <select
              className="h-11 w-full rounded-md border border-luxora-ink/15 bg-white/95 px-10 text-sm outline-none transition focus:border-luxora-gold focus:ring-2 focus:ring-luxora-gold/20"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option value={item.slug} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <Input placeholder="Min $" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} inputMode="numeric" />
          <Input placeholder="Max $" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} inputMode="numeric" />
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-md bg-white" />
          ))}
        </div>
      ) : products.length ? (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </section>
      ) : (
        <EmptyState title="No products match these filters" />
      )}
    </div>
  );
}
