import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { error_response } from "../utils/response_handler";

export const validate_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();
  const extractedErrors = [];
  errors.array().forEach((err: any) => {
    extractedErrors.push(`${err.param} invalid`);
  });

  return error_response(res, 400, errors.array()[0], "Validation error");
};
