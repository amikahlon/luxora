import type { ProductImage } from "../types";

export const productImageFallback =
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80";

export const getPrimaryProductImage = (images: ProductImage[], fallbackAlt: string) => ({
  src: images[0]?.url ?? productImageFallback,
  alt: images[0]?.altText ?? fallbackAlt,
});
