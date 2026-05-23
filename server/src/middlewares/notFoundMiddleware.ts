import type { RequestHandler } from "express";

export const notFoundMiddleware: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} was not found`,
    code: "ROUTE_NOT_FOUND",
  });
};
