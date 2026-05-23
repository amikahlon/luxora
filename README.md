## Development Approach

I started this project by planning the architecture before generating any code.

First, I designed the general system structure myself:

- frontend and backend separation
- database structure
- API flow
- project folders
- authentication flow
- checkout flow

During this process I also consulted with AI tools such as Claude to validate architecture decisions, think about scalability, and improve the overall generation workflow.

Technology choices like:

- TanStack Query
- Zustand
- Prisma ORM
- Tailwind CSS
- Framer Motion

were selected based on my own previous experience together with AI discussions about modern frontend/backend best practices.

After the architecture phase, I created the AI Blueprint files inside `ai-blueprint/`.

The goal of these files was to guide the AI agent step-by-step instead of generating the entire project in one uncontrolled prompt.

The workflow was split into phases:

1. Architecture & DB planning
2. Backend foundation
3. Authentication
4. Product catalog
5. Cart & checkout
6. Frontend integration
7. UI refinement

The AI was mainly used for implementation and iteration, while architecture decisions, reviews, corrections, and refinements remained manual.

Before continuing between phases, I reviewed the generated structure, validated the architecture, and adjusted areas where the AI output was not clean or maintainable enough.

---

## AI Blueprint

All AI guidance files are located inside `ai-blueprint/`.

- `architecture.md`
- `engineering-guidelines.md`
- `capability-definitions.md`
- `initial.md`
- `generation-phases.md`
- `ai-interactions.md`

`ai-interactions.md` contains the full AI workflow process, including prompts, architectural discussions, technology decisions, generation flow, model usage, and manual refinements made during the project.

I also checked the AI-generated code by myself and did not accept everything automatically. One specific bug I found was in the Prisma setup. The generated schema used the old `url = env("DATABASE_URL")` style inside `schema.prisma`, but this project was using Prisma 7, where the database URL must be handled from `prisma.config.ts` and the runtime client needs a database adapter. The migration also failed because the normal MySQL user could not create the Prisma shadow database. I fixed this manually by moving the datasource config to `prisma.config.ts`, adding the MariaDB adapter for Prisma Client, and adding a separate `SHADOW_DATABASE_URL` with the Docker root user.

I also found a small UI bug myself: the mobile menu icon was visible in the header, but clicking it did not open any menu. Instead of asking AI to redesign the whole header again, I added a small local state for the mobile menu and connected the icon to open and close the menu. This was an "AI gap" for me: another prompt could maybe generate more code, but reading the actual error, testing the UI like a user, and making the small correct fix was faster and safer.

---

## How To Run The Project After Clone

This guide is for someone who cloned the project from GitHub and wants to see the full app working locally.

### 1. Requirements

Make sure you have these installed:

- Node.js
- npm
- Docker Desktop

Docker must be running before starting the database.

---

### 2. Install Dependencies

From the project root, install the backend dependencies:

```bash
cd server
npm install
```

Then install the frontend dependencies:

```bash
cd ../client
npm install
```

Go back to the project root:

```bash
cd ..
```

---

### 3. Start MySQL With Docker

From the project root, run:

```bash
docker compose up -d mysql
```

This starts a MySQL database container for the project.

---

### 4. Setup Environment File

Inside the `server` folder, create a `.env` file.

You can copy the example file:

```bash
cd server
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
cd server
Copy-Item .env.example .env
```

The default values are already prepared for the Docker database.

---

### 5. Run Database Migration

Still inside the `server` folder, run:

```bash
npm run prisma:migrate
```

This creates the database tables.

---

### 6. Seed Demo Data

Run:

```bash
npm run prisma:seed
```

This adds demo categories, products, a normal demo user, and an admin user.

---

### 7. Start The Backend

In the `server` folder, run:

```bash
npm run dev
```

The backend API will run at:

```txt
http://localhost:4000
```

Quick health check:

```txt
http://localhost:4000/api/health
```

---

### 8. Start The Frontend

Open a second terminal.

From the `client` folder, run:

```bash
cd client
npm run dev
```

The frontend will run at:

```txt
http://localhost:5173
```

Open this URL in your browser.

---

## Demo Users

### Normal User

Use this account to test shopping, cart, checkout, and account orders:

```txt
Email: demo@luxora.dev
Password: Password123!
```

### Admin User

Use this account to test the admin dashboard:

```txt
Email: admin@luxora.dev
Password: Admin123!
```

After logging in as the admin user, open:

```txt
http://localhost:5173/admin
```

The admin screen lets you:

- see revenue, orders, products, and customers
- update product stock
- turn products active/inactive
- mark products as featured
- update order status

---

## Useful Commands

### View The Database With Prisma Studio

Prisma Studio lets you see the database tables in the browser.

First, make sure MySQL is running:

```bash
docker compose up -d mysql
```

Then start Prisma Studio:

```bash
cd server
npm run db:studio
```

Prisma Studio usually opens automatically in the browser.

If it does not open, go to:

```txt
http://localhost:5555
```

Inside Prisma Studio you can see the project tables, for example:

- `User`
- `Category`
- `Product`
- `ProductImage`
- `Cart`
- `CartItem`
- `Order`
- `OrderItem`
- `Address`

The demo users and demo products will appear there only after running:

```bash
npm run prisma:migrate
npm run prisma:seed
```

Build backend:

```bash
cd server
npm run build
```

Build frontend:

```bash
cd client
npm run build
```

Stop the database:

```bash
docker compose down
```
