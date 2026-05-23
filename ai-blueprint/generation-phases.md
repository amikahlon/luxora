# LUXORA — Generation Phases

## Phase 1 — Project Setup

- Initialize `client/` with React + Vite + TypeScript
- Initialize `server/` with Express + TypeScript
- Create Dockerized MySQL setup
- Install core dependencies
- Verify both projects compile successfully

---

## Phase 2 — Database Foundation

- Create Prisma schema with the following models:
  - User (email, passwordHash, firstName, lastName, role)
  - Address (userId, label, street, city, state, zipCode, country, isDefault)
  - Category (name, slug, description, imageUrl)
  - Product (categoryId, name, slug, description, price, compareAtPrice, sku, stock, isActive, isFeatured)
  - ProductImage (productId, url, altText, sortOrder)
  - Cart (userId unique)
  - CartItem (cartId, productId, quantity, unique on cartId+productId)
  - Order (userId, status, totalAmount, shippingAddressId, paymentMethod, paymentStatus)
  - OrderItem (orderId, productId, quantity, unitPrice, totalPrice)

- Run initial migration

- Create seed script with demo categories, products, and one test user

---

## Phase 3 — Backend Foundation

- Configure Express app
- Create middlewares
- Configure validation and error handling
- Add health check endpoint

---

## Phase 4 — Authentication

- Register
- Login
- JWT authentication
- Protected routes
- Current user endpoint

---

## Phase 5 — Products

- Product listing
- Search and filtering
- Product details
- Featured products

---

## Phase 6 — Cart

- Add to cart
- Update quantity
- Remove items
- Persistent user cart

---

## Phase 7 — Checkout & Orders

- Multi-step checkout flow
- Order creation
- Order history
- Order details

---

## Phase 8 — Frontend Foundation

- Configure routing
- Configure TanStack Query
- Configure Axios instance
- Build shared UI components
- Configure Tailwind theme

---

## Phase 9 — Frontend Features

- Auth pages
- Product catalog
- Product details
- Cart drawer
- Checkout pages
- Account pages

---

## Phase 10 — Final Review

- Verify full application flow
- Verify responsive layout
- Review AI gaps
- Refine UI and architecture consistency
