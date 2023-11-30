import { Response } from "express";

export const error_response = (
  res: Response,
  statusCode: number = 500,
  error: any,
  message: string = "Server  Error"
) => res.status(statusCode).json({ success: false, message, error });

export const success_response = (
  res: Response,
  statusCode: number = 200,
  data?: any,
  message: string = "Success"
) => res.status(statusCode).json({ success: true, message, data });
