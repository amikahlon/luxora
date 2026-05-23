# LUXORA — Capability Definitions

## Backend Modules

### Auth

- User registration with email and password
- Login with JWT authentication
- Refresh token support for persistent sessions
- Password hashing with bcrypt
- Protected route middleware

### Users

- Get current user profile
- Update profile details
- Manage saved addresses

### Products

- Product listing with pagination
- Search and filtering
- Category filtering
- Single product page with image gallery
- Featured products query

### Cart

- One cart per user
- Add item to cart
- Update quantity
- Remove item from cart
- Retrieve full cart with product details

### Orders

- Create order from current cart
- Calculate totals from cart items
- Store price snapshot at purchase time
- User order history
- Order details retrieval

### Checkout

- Multi-step checkout flow
- Address validation
- Payment step simulation
- Stock validation before confirmation
- Clear cart after successful order

---

## Frontend Features

### Auth Feature

- Login page
- Register page
- Form validation
- Auth state handling and session persistence
- Protected route wrapper

### Catalog Feature

- Responsive product grid
- Search with debounced input
- Category filtering
- Price range filtering
- Product details page

### Cart Feature

- Slide-out cart drawer
- Quantity controls
- Cart summary
- Empty cart state

### Checkout Feature

- Multi-step checkout UI
- Address form
- Payment method selection
- Order review page
- Order confirmation page

### Account Feature

- Editable profile page
- Order history
- Order details page
- Saved addresses management

---

## Shared Capabilities

### API Layer

- Centralized Axios instance
- Auth request interceptor
- Global error handling interceptor
- Per-feature TanStack Query hooks

### UI Components

- Button
- Input
- Modal
- Badge
- Loader
- Toast notifications
- Empty state components

### Utilities

- `formatPrice(amount)`
- `formatDate(date)`
- `slugify(text)`
- `cn(...classes)`

### Data Seeding

- Demo categories and products
- Seeded demo product images
- Demo user account for testing

---

## Edge Case Handling

- Prevent checkout with empty cart
- Prevent duplicate email registration
- Handle invalid product IDs
- Validate stock before checkout
- Handle expired authentication tokens

---

## Admin-Ready Foundation

- Role-based architecture prepared for future admin capabilities
- Product and order modules designed for future management flows
