import { Eye, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";
import { useCartDrawerStore } from "../cart/cartDrawerStore";
import { useAddCartItemMutation } from "../cart/queries";
import { Badge } from "../../shared/components/Badge";
import { Button } from "../../shared/components/Button";
import { formatPrice } from "../../shared/lib/format";
import { getPrimaryProductImage } from "../../shared/lib/images";
import type { Product } from "../../shared/types";

export function ProductCard({ product }: { product: Product }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const addCartItem = useAddCartItemMutation();
  const openCart = useCartDrawerStore((state) => state.open);
  const navigate = useNavigate();
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
    <article className="group overflow-hidden rounded-md border border-luxora-gold/20 bg-white/92 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-luxora-gold/45 hover:shadow-luxora">
      <Link to={`/products/${product.slug}`} className="relative block overflow-hidden bg-luxora-mist">
        <img
          className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
          src={primaryImage.src}
          alt={primaryImage.alt}
        />
        <div className="absolute inset-0 bg-luxora-ink/0 transition group-hover:bg-luxora-ink/18" />
        <span className="absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-xs font-semibold text-luxora-ink opacity-0 shadow-sm backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">
          <Eye size={14} />
          View piece
        </span>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-luxora-sage">{product.category.name}</p>
            <Link to={`/products/${product.slug}`} className="mt-2 block min-h-12 text-lg font-semibold leading-snug text-luxora-ink">
              {product.name}
            </Link>
          </div>
          {product.isFeatured ? <Badge>Featured</Badge> : null}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <strong className="text-lg">{formatPrice(product.price)}</strong>
            {product.compareAtPrice ? (
              <span className="block text-sm text-luxora-ink/40 line-through sm:inline sm:pl-2">{formatPrice(product.compareAtPrice)}</span>
            ) : null}
          </div>
          <Button
            aria-label={`Add ${product.name} to cart`}
            title="Add to cart"
            className="h-9 w-9 px-0"
            disabled={product.stock === 0 || addCartItem.isPending}
            onClick={addToCart}
          >
            <ShoppingBag size={17} />
          </Button>
        </div>
      </div>
    </article>
  );
}
