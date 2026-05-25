## Luxora

Luxora is a full-stack luxury e-commerce demo application.

The project includes:

- React + Vite frontend
- Node.js + Express backend
- Prisma ORM
- MySQL database
- Docker Compose setup for running the full project with one command

---

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

---

I also checked the AI-generated code by myself and did not accept everything automatically. One specific bug I found was in the Prisma setup. The generated schema used the old `url = env("DATABASE_URL")` style inside `schema.prisma`, but this project was using Prisma 7, where the database URL must be handled from `prisma.config.ts` and the runtime client needs a database adapter. The migration also failed because the normal MySQL user could not create the Prisma shadow database. I fixed this manually by moving the datasource config to `prisma.config.ts`, adding the MariaDB adapter for Prisma Client, and adding a separate `SHADOW_DATABASE_URL` with the Docker root user.

I also found a small UI bug myself: the mobile menu icon was visible in the header, but clicking it did not open any menu. Instead of asking AI to redesign the whole header again, I added a small local state for the mobile menu and connected the icon to open and close the menu. This was an "AI gap" for me: another prompt could maybe generate more code, but reading the actual error, testing the UI like a user, and making the small correct fix was faster and safer.

---

## Run The Full Project With Docker Compose

This is the recommended way to run the project after cloning it.

### Requirements

- Docker Desktop

Docker must be running before starting the app.

### Start everything

From the project root, run:

```bash
docker compose up --build
```

This single command starts:

- MySQL database
- backend API
- Prisma migrations
- demo data seed
- frontend app

After the containers finish starting, open:

```txt
http://localhost:5173
```

The backend API runs at:

```txt
http://localhost:4000
```

Health check:

```txt
http://localhost:4000/api/health
```

### Stop the project

```bash
docker compose down
```

To stop the project and delete the local database volume:

```bash
docker compose down -v
```

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
