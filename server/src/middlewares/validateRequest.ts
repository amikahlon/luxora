import type { RequestHandler } from "express";
import type { ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export const validateRequest = (schemas: RequestSchemas): RequestHandler => {
  return (req, _res, next) => {
    if (schemas.body) {
      const validatedBody = schemas.body.parse(req.body);
      req.body = validatedBody;
      req.validatedBody = validatedBody;
    }

    if (schemas.params) {
      req.validatedParams = schemas.params.parse(req.params);
    }

    if (schemas.query) {
      req.validatedQuery = schemas.query.parse(req.query);
    }

    next();
  };
};
