import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./prisma/client";

const server = app.listen(env.PORT, () => {
  console.info(`LUXORA API running on port ${env.PORT}`);
});

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
