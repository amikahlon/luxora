import type { Request } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/appError";
import { cartService } from "./service";
import type { AddCartItemInput, CartItemParams, UpdateCartItemInput } from "./validation";

const getUserId = (user?: Request["user"]) => {
  if (!user) {
    throw new AppError("Authentication is required", 401, "AUTH_REQUIRED");
  }

  return user.id;
};

export const cartController = {
  getCart: asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(getUserId(req.user));

    res.json({
      success: true,
      data: cart,
    });
  }),

  addItem: asyncHandler(async (req, res) => {
    const cart = await cartService.addItem(
      getUserId(req.user),
      req.validatedBody as AddCartItemInput,
    );

    res.status(201).json({
      success: true,
      data: cart,
    });
  }),

  updateItem: asyncHandler(async (req, res) => {
    const params = req.validatedParams as CartItemParams;
    const cart = await cartService.updateItem(
      getUserId(req.user),
      params.itemId,
      req.validatedBody as UpdateCartItemInput,
    );

    res.json({
      success: true,
      data: cart,
    });
  }),

  removeItem: asyncHandler(async (req, res) => {
    const params = req.validatedParams as CartItemParams;
    const cart = await cartService.removeItem(getUserId(req.user), params.itemId);

    res.json({
      success: true,
      data: cart,
    });
  }),
};
