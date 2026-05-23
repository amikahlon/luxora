import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

const databaseUrl = new URL(env.DATABASE_URL);
const adapter = new PrismaMariaDb(env.DATABASE_URL, {
  database: databaseUrl.pathname.replace("/", ""),
});

export const prisma = new PrismaClient({ adapter });
