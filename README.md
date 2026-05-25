## Luxora

Luxora is a full-stack luxury e-commerce demo app.

The app includes:

- React frontend
- Node.js and Express backend
- MySQL database
- Prisma ORM
- Prisma Studio
- Docker Compose setup

---

## How To Run

Make sure Docker Desktop is running.

From the project root, run:

```bash
docker compose up --build
```

This command starts the full project:

- MySQL database
- backend API
- frontend app
- Prisma migrations
- demo data seed
- Prisma Studio

---

## Open The App

Frontend:

```txt
http://localhost:5173
```

Backend health check:

```txt
http://localhost:4000/api/health
```

Prisma Studio:

```txt
http://localhost:5555
```

---

## Demo Users

Normal user:

```txt
Email: demo@luxora.dev
Password: Password123!
```

Admin user:

```txt
Email: admin@luxora.dev
Password: Admin123!
```

After logging in as the admin user, open:

```txt
http://localhost:5173/admin
```

The admin page allows you to:

- view revenue, orders, products, and customers
- update product stock
- activate or deactivate products
- mark products as featured
- update order status

---

## Stop The Project

Stop all containers:

```bash
docker compose down
```

Stop all containers and delete the local database data:

```bash
docker compose down -v
```
