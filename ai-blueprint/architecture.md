# LUXORA - System Architecture

## Stack

### Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- TanStack Query
- Zustand

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT
- Zod

---

# Architecture

```txt
React Client
   ↓
Express API
   ↓
Prisma ORM
   ↓
MySQL (Docker)
```

Frontend handles UI, routing, cart flow, and API communication.

Backend handles authentication, validation, business logic, and database access.

---

# Frontend Structure

```txt
client/src/
├── app/
├── features/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   └── account/
├── shared/
└── styles/
```

### State Management

- TanStack Query → server state
- Zustand → lightweight UI state

Business logic should stay outside UI components whenever possible.

---

# Backend Structure

```txt
server/src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   └── checkout/
├── middlewares/
├── prisma/
└── utils/
```

### Backend Layers

- Routes
- Controllers
- Services
- Repositories
- Middlewares

Business logic should remain inside services.

---

# Database Design

## Entities

```txt
User
Category
Product
ProductImage
Cart
CartItem
Order
OrderItem
Address
```

## Relationships

```txt
User 1---1 Cart
User 1---N Orders

Category 1---N Products
Product 1---N ProductImages

Cart 1---N CartItems
Order 1---N OrderItems
```

## Main Tables

### User

- id
- email
- passwordHash
- firstName
- lastName
- role

### Product

- id
- categoryId
- name
- slug
- description
- price
- stock
- isFeatured

### CartItem

- cartId
- productId
- quantity

### Order

- userId
- totalAmount
- paymentStatus
- shippingAddressId

---

# API Endpoints

## Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Products

```txt
GET /api/products
GET /api/products/:id
```

Supports search and filtering.

## Cart

```txt
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:id
DELETE /api/cart/items/:id
```

## Orders

```txt
POST /api/checkout
GET  /api/orders
```

---

# API Response Format

## Success

```json
{
  "success": true,
  "data": {}
}
```

## Error

```json
{
  "success": false,
  "message": "Invalid credentials",
  "code": "AUTH_INVALID"
}
```

---

# UI Direction

LUXORA should feel premium and modern.

Design goals:

- Minimal luxury aesthetic
- Smooth animations
- Clean spacing
- Responsive layout
- Premium product cards
- Elegant checkout flow

---

# AI Workflow

```txt
1. Generate architecture and DB schema
2. Generate backend foundation
3. Generate authentication
4. Generate products module
5. Generate cart & checkout
6. Generate frontend pages
7. Connect frontend and backend
8. Review and fix AI gaps
```

The AI acts as an implementation assistant while architecture and review remain manual.
