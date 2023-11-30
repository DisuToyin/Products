import { NextFunction, Request, Response } from "express";

import { success_response, error_response } from "../utils/response_handler";
import { create_new_order, get_user_orders } from "../services/order";

import { CustomRequest } from "../types";

export const create_order = async (req: CustomRequest, res: Response) => {
  try {
    const payload = req.body;
    const user_id = req.user.id;

    const order = await create_new_order(payload, user_id);

    return success_response(res, 201, order, "Successfully created order");
  } catch (error) {
    console.log(error);
    let message =
      error?.code === 11000
        ? `You have an order with this product already`
        : "";
    return error_response(res, 500, error, message);
  }
};

export const get_orders = async (req: CustomRequest, res: Response) => {
  try {
    const user_id = req.user.id;

    const orders = await get_user_orders(user_id);
    return success_response(
      res,
      201,
      orders,
      "Successfully fetched your orders"
    );
  } catch (error) {
    return error_response(res, 500, error);
  }
};
