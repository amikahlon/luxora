import type { Response } from "express";
import { env } from "../../config/env";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/appError";
import { authService } from "./service";

const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const setRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie("luxora_refresh_token", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
  });
};

export const authController = {
  register: asyncHandler(async (req, res) => {
    const authResult = await authService.register(req.body);
    setRefreshCookie(res, authResult.refreshToken);

    res.status(201).json({
      success: true,
      data: {
        user: authResult.user,
        accessToken: authResult.accessToken,
      },
    });
  }),

  login: asyncHandler(async (req, res) => {
    const authResult = await authService.login(req.body);
    setRefreshCookie(res, authResult.refreshToken);

    res.json({
      success: true,
      data: {
        user: authResult.user,
        accessToken: authResult.accessToken,
      },
    });
  }),

  me: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AppError("Authentication is required", 401, "AUTH_REQUIRED");
    }

    const user = await authService.getCurrentUser(req.user.id);

    res.json({
      success: true,
      data: { user },
    });
  }),
};
