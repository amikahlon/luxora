import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { env } from "../config/env";
import { prisma } from "../prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";

type AccessTokenPayload = {
  sub: string;
  role: "USER" | "ADMIN";
};

const getBearerToken = (authorizationHeader?: string) => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length);
};

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    throw new AppError("Authentication is required", 401, "AUTH_REQUIRED");
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError("Authenticated user was not found", 401, "AUTH_USER_NOT_FOUND");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired token", 401, "AUTH_INVALID_TOKEN");
  }
});

export const requireRole = (...roles: Role[]) =>
  asyncHandler(async (req, _res, next) => {
    if (!req.user) {
      throw new AppError("Authentication is required", 401, "AUTH_REQUIRED");
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Admin access is required", 403, "AUTH_FORBIDDEN");
    }

    next();
  });
