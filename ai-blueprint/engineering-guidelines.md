# LUXORA — Engineering Guidelines

## Language

- TypeScript across the entire project
- Strict mode enabled
- Avoid using `any` whenever possible

---

## Naming Conventions

- Files: camelCase for utilities, PascalCase for components
- Variables and functions: camelCase
- Types and interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE
- Database fields: camelCase
- API routes: kebab-case

---

## Project Conventions

- Each backend module contains:
  - `routes.ts`
  - `controller.ts`
  - `service.ts`
  - `validation.ts`

- Each frontend feature is isolated inside `features/`

- Shared UI components belong inside `shared/components/`

- Business logic should remain inside services

- React components should stay focused on UI

- Protected resources must validate resource ownership

---

## Backend Standards

- Centralized backend error handling

- Shared `AppError` class for expected errors

- Async route handlers wrapped with `asyncHandler`

- Validation middleware before controllers

- Configure security middlewares:
  - `cors`
  - `helmet`
  - `cookie-parser`

- Authorization checks should remain separate from business logic whenever possible

---

## Validation

- All incoming requests validated with Zod
- Frontend forms use React Hook Form + Zod
- Validation schemas should remain close to their feature/module
- Return consistent validation error responses

---

## Authentication & Security

- JWT-based authentication
- Short-lived access tokens
- Refresh token support for persistent sessions
- Passwords hashed using bcrypt
- Protected routes handled through auth middleware
- Sensitive tokens should not be exposed to frontend JavaScript
- Users should only access their own orders, cart, and addresses

---

## API Standards

All responses should follow a consistent structure:

```json id="ib1t49"
{
  "success": true,
  "data": {}
}
```

Errors:

```json id="g2qqw5"
{
  "success": false,
  "message": "Invalid credentials",
  "code": "AUTH_INVALID"
}
```

- Use proper HTTP status codes
- Pagination responses should include metadata

---

## Frontend Standards

- TanStack Query for server state
- Zustand only for lightweight UI state
- Axios instance for all API communication
- No raw fetch calls
- Tailwind CSS for styling
- Framer Motion for animations
- Avoid inline styles
- Protected routes should redirect unauthorized users cleanly

---

## Code Quality

- No console.log in production code
- Avoid magic numbers
- Functions should have a single responsibility
- Large files should be split into smaller focused modules when appropriate
- Keep imports organized and consistent
- Prefer readable and maintainable code over clever abstractions

---

## Edge Case Handling

- Prevent checkout with empty cart
- Prevent duplicate email registration
- Validate stock before order creation
- Handle expired or invalid JWT tokens
- Handle invalid product IDs
- Return consistent validation errors

---

## Basic Testing Expectations

- Verify protected routes
- Verify validation and error handling
- Verify checkout flow
- Verify responsive layout on mobile viewport

---

## AI Generation Rules

- Prioritize readability and maintainability
- Avoid unnecessary abstractions
- Generate reusable components and utilities whenever possible
- Keep architecture predictable across the project
- Prefer simple and scalable solutions over over-engineering
