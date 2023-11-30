// external packages
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

// internal
import { error_response } from "../utils/response_handler";
import { User } from "../models/user";
import { CustomRequest } from "../types";

// secret var
const ACCESS_TOKEN_SECRET = "suywghb748urhuhgw9";
const MESSAGE = "Not Authorised";
const ERROR = "Request not authenticated";

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return error_response(res, 401, MESSAGE, ERROR);
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return error_response(res, 401, MESSAGE, ERROR);
  }

  verify(token, ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
    if (err) return error_response(res, 403, "Invalid Token", ERROR);
    req.user = decoded;
    return next();
  });
};
