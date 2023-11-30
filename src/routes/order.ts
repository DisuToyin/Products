import express from "express";

import { auth } from "../middlewares/auth";
import { validate_request } from "../middlewares/request_validator";
import {
  create_order,
  get_orders,
  //   get_all_user_order,
  //   update_order,
  //   delete_order,
} from "../controllers/order";

import { order_validation_rules } from "../rules/order";

export default (router: express.Router) => {
  router.use(auth);
  router.post(
    "/orders",
    order_validation_rules,
    validate_request,
    create_order
  );

  router.get("/orders", auth, get_orders);

  //   router.put("/orders/:id", auth, update_order);

  //   router.delete("/orders/:id", auth, delete_order);
};
