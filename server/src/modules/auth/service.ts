import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/appError";
import type { LoginInput, RegisterInput } from "./validation";

const PASSWORD_SALT_ROUNDS = 12;

type SafeUser = Pick<User, "id" | "email" | "firstName" | "lastName" | "role" | "createdAt">;

type AuthResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  createdAt: true,
} as const;

const signAccessToken = (user: Pick<User, "id" | "role">) => {
  const options: SignOptions = {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign({ role: user.role }, env.JWT_SECRET, options);
};

const signRefreshToken = (user: Pick<User, "id" | "role">) => {
  const options: SignOptions = {
    subject: user.id,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign({ role: user.role }, env.JWT_REFRESH_SECRET, options);
};

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new AppError("Email is already registered", 409, "AUTH_EMAIL_EXISTS");
    }

    const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
        },
        select: userSelect,
      });

      await tx.cart.create({
        data: { userId: createdUser.id },
      });

      return createdUser;
    });

    return {
      user,
      accessToken: signAccessToken(user),
      refreshToken: signRefreshToken(user),
    };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401, "AUTH_INVALID_CREDENTIALS");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401, "AUTH_INVALID_CREDENTIALS");
    }

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
    };

    return {
      user: safeUser,
      accessToken: signAccessToken(user),
      refreshToken: signRefreshToken(user),
    };
  },

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) {
      throw new AppError("User was not found", 404, "USER_NOT_FOUND");
    }

    return user;
  },
};
