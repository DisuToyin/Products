import { NextFunction, Request, Response } from "express";

import { success_response, error_response } from "../utils/response_handler";
import {
  create_new_product,
  get_products_by_user_id,
  fetch_product_by_id,
  does_user_have_access_to_product,
  delete_product_by_id,
  update_product_by_id,
} from "../services/product";
import { CustomRequest } from "../types";

export const create_product = async (req: CustomRequest, res: Response) => {
  try {
    const payload = req.body;
    const user_id = req.user.id;
    payload.user_id = user_id;
    const product = await create_new_product(payload);
    success_response(res, 201, product, "Successfully created product");
  } catch (error) {
    console.log(error);
    let message =
      error?.code === 11000
        ? `Product name (${req.body.name}) already exists for you`
        : "";
    return error_response(res, 500, error, message);
  }
};

export const get_all_user_products = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const user_id = req.user.id;
    const products = await get_products_by_user_id(user_id);
    success_response(res, 200, products, "Successfully fetched products");
  } catch (error) {
    return error_response(res, 500, error);
  }
};

export const get_product_by_id = async (req: CustomRequest, res: Response) => {
  try {
    const user_id = req.user.id;
    const product_id = req.params.id;
    const has_access_to_product = await does_user_have_access_to_product(
      user_id,
      product_id
    );
    if (!has_access_to_product) {
      return error_response(
        res,
        403,
        "You cant view this product",
        "This product does not exist/You are not authorised to fetch this product"
      );
    }
    const product = await fetch_product_by_id(product_id);
    success_response(res, 200, product, "Successfully fetched product");
  } catch (error) {
    return error_response(res, 500, error);
  }
};

export const update_product = async (req: CustomRequest, res: Response) => {
  try {
    const user_id = req.user.id;
    const product_id = req.params.id;
    const payload = req.body;
    const has_access_to_product = await does_user_have_access_to_product(
      user_id,
      product_id
    );
    if (!has_access_to_product) {
      return error_response(
        res,
        403,
        "You cant update this product",
        "This product does not exist/You are not authorised to update this product"
      );
    }
    const product = await update_product_by_id(product_id, payload);
    success_response(res, 200, product, "Successfully updated product");
  } catch (error) {
    return error_response(res, 500, error);
  }
};

export const delete_product = async (req: CustomRequest, res: Response) => {
  try {
    const user_id = req.user.id;
    const product_id = req.params.id;
    const has_access_to_product = await does_user_have_access_to_product(
      user_id,
      product_id
    );
    if (!has_access_to_product) {
      return error_response(
        res,
        403,
        "You cant delete this product",
        "This product does not exist/You are not authorised to delete this product"
      );
    }
    const product = await delete_product_by_id(product_id);
    success_response(res, 204, product, "Successfully deleted product");
  } catch (error) {
    return error_response(res, 500, error);
  }
};
