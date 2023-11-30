import express from "express";

import { auth } from "../middlewares/auth";
import {
  create_product,
  get_product_by_id,
  get_all_user_products,
  update_product,
  delete_product,
} from "../controllers/product";

export default (router: express.Router) => {
  router.use(auth);
  router.post("/products", create_product);

  router.get("/products", get_all_user_products);
  router.get("/products/:id", get_product_by_id);

  router.put("/products/:id", update_product);

  router.delete("/products/:id", delete_product);
};
