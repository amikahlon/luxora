export type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  altText: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string | null;
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category: Category;
  images: ProductImage[];
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  product: Pick<Product, "id" | "name" | "slug" | "stock" | "images" | "category" | "price">;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  summary: {
    totalAmount: string;
    totalQuantity: number;
  };
};

export type Order = {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    product: Pick<Product, "id" | "name" | "slug" | "images">;
  }>;
};
