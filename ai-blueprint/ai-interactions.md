# AI Interactions Log

## Tools & Models

- Cline & Codex - main AI coding tools
- Claude Opus 4.7-fast - simple tasks and setup
- Claude Opus 4.7 - authentication, DB logic, checkout flow
- Claude (claude.ai) - planning and reviewing ideas
- Codex - used throughout the project for generation support, debugging, architecture validation, and improving generated code quality

---

## Project Setup

### Model

Claude Opus 4.7-fast

### Prompt

"Read all AI Blueprint files and execute only Phase 1."

### Result

Generated:

- client/
- server/
- docker-compose.yml
- dependencies
- base structure

---

## Database Foundation

### Model

Claude Opus 4.7

### Prompt

"Generate Prisma schema from the architecture files."

### Result

Generated:

- Prisma schema
- relationships
- migrations
- seed script

### Manual Fixes

- improved relationships
- fixed naming consistency
- updated ProductImage structure

---

## Backend Foundation

### Model

Claude Opus 4.7-fast

### Prompt

"Generate Express backend with modular structure, middleware, validation, and error handling."

### Result

Generated:

- routes
- controllers
- services
- middleware
- validation setup

---

## Authentication

### Model

Claude Opus 4.7

### Prompt

"Generate JWT authentication flow with protected routes and bcrypt."

### Result

Generated:

- register/login flow
- auth middleware
- protected routes
- token handling

---

## Debugging

### Tools

Postman + Codex

### Issue

While testing endpoints in Postman, I noticed inconsistent JSON responses between validation errors and auth errors.

### Prompt

I provided only the relevant backend files related to middleware and error handling instead of the entire project.

"Refactor these files so all API responses use one consistent JSON structure."

### Result

Unified API responses across the backend.

---

## Frontend Foundation

### Model

Claude Opus 4.7-fast

### Prompt

"Generate React frontend foundation with Vite, Tailwind, TanStack Query, and Zustand."

### Result

Generated:

- routing
- query setup
- axios layer
- shared components
- feature folders

---

## State Management Fix

### Issue

Zustand was being used for server-side data.

### Prompt

I shared only the relevant frontend state files and hooks instead of the whole frontend.

"Move server state to TanStack Query and keep Zustand only for UI state."

### Result

Improved frontend state structure and simplified data flow.

---

## Checkout & Orders

### Model

Claude Opus 4.7

### Prompt

"Generate multi-step checkout flow with order creation and order history."

### Result

Generated:

- checkout endpoint
- order creation
- cart clearing after checkout
- order history
- order details

### Manual Fixes

- added stock validation before order creation
- wrapped checkout in a transaction

---

## UI Refinement

### Prompt

I shared only the UI components and pages related to layout and product cards.

"Refine the UI so it feels more premium and modern."

### Result

Improved:

- spacing
- product cards
- checkout layout
- responsive design
- typography

---

## Logout Cart State Bug

### Issue

After logout, the cart icon in the navbar still showed the previous cart item count instead of resetting.

### Tools

Postman + Codex

### Prompt

I shared only the relevant auth, cart, and navbar state files instead of the entire frontend.

"Fix the logout flow so cart-related UI state and cached user cart queries are cleared immediately after logout."

### Result

Fixed:

- stale cart badge count
- cached cart query cleanup
- logout state synchronization between auth and cart state

## Registration Error Handling

### Issue

Some registration errors returned generic server messages instead of clear business validation messages.

For example, trying to register with an existing email returned a generic error instead of explaining that the email already exists.

### Tools

Postman + Codex

### Prompt

I shared only the relevant auth controller, service, and validation files instead of the entire backend.

"Refactor registration error handling so duplicate email registration returns a clear and user-friendly validation message."

### Result

Fixed:

- duplicate email validation handling
- clearer API error messages
- consistent auth validation responses
