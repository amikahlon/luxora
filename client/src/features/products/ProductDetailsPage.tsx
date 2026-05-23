import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";
import { useCartDrawerStore } from "../cart/cartDrawerStore";
import { useAddCartItemMutation } from "../cart/queries";
import { Badge } from "../../shared/components/Badge";
import { Button } from "../../shared/components/Button";
import { EmptyState } from "../../shared/components/EmptyState";
import { formatPrice } from "../../shared/lib/format";
import { getPrimaryProductImage } from "../../shared/lib/images";
import { getProduct } from "./api";

export function ProductDetailsPage() {
  const { productId } = useParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const openCart = useCartDrawerStore((state) => state.open);
  const addCartItem = useAddCartItemMutation();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId ?? ""),
    enabled: Boolean(productId),
  });

  if (isLoading) {
    return <div className="h-[520px] animate-pulse rounded-md bg-white" />;
  }

  if (!product) {
    return <EmptyState title="Product not found" />;
  }

  const primaryImage = getPrimaryProductImage(product.images, product.name);

  const addToCart = () => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    addCartItem.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: openCart,
      },
    );
  };

  return (
    <article>
      <Link to="/products" className="mb-5 inline-flex items-center gap-2 rounded-md bg-white/70 px-3 py-2 text-sm font-semibold text-luxora-ink/70 shadow-sm transition hover:text-luxora-ink">
        <ArrowLeft size={16} />
        Back to catalog
      </Link>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <img
            className="aspect-[4/5] w-full rounded-md border border-luxora-gold/25 object-cover shadow-luxora"
            src={primaryImage.src}
            alt={primaryImage.alt}
          />
          <div className="hidden gap-3 sm:grid">
            {product.images.slice(0, 3).map((image) => (
              <img key={image.id} className="h-28 rounded-md border border-luxora-gold/20 object-cover shadow-sm" src={image.url} alt={image.altText} />
            ))}
          </div>
        </div>
        <div className="rounded-md border border-luxora-gold/20 bg-white/92 p-6 shadow-luxora backdrop-blur lg:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{product.category.name}</Badge>
            {product.isFeatured ? <Badge>Featured</Badge> : null}
          </div>
          <h1 className="mt-6 max-w-2xl font-display text-5xl leading-none text-luxora-ink sm:text-6xl">{product.name}</h1>
          <p className="mt-4 leading-7 text-luxora-ink/65">{product.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-luxora-ink/10 bg-luxora-cream/80 p-4">
              <Sparkles className="text-luxora-gold" size={19} />
              <p className="mt-2 text-sm font-semibold">Curated finish</p>
              <p className="mt-1 text-xs leading-5 text-luxora-ink/55">Selected for material, silhouette and lasting presence.</p>
            </div>
            <div className="rounded-md border border-luxora-ink/10 bg-luxora-cream/80 p-4">
              <ShieldCheck className="text-luxora-sage" size={19} />
              <p className="mt-2 text-sm font-semibold">Protected checkout</p>
              <p className="mt-1 text-xs leading-5 text-luxora-ink/55">Inventory is reserved only after order confirmation.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-end gap-3">
            <strong className="text-3xl">{formatPrice(product.price)}</strong>
            {product.compareAtPrice ? (
              <span className="pb-1 text-luxora-ink/40 line-through">{formatPrice(product.compareAtPrice)}</span>
            ) : null}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Button disabled={product.stock === 0 || addCartItem.isPending} onClick={addToCart}>
              <ShoppingBag size={18} />
              Add to cart
            </Button>
            <div className="rounded-md bg-luxora-mist px-4 py-2 text-sm text-luxora-ink/65">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
