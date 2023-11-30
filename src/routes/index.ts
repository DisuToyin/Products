import express from "express";

import user from "./user";
import product from "./product";
import order from "./order";

const router = express.Router();

export default (): express.Router => {
  user(router);
  product(router);
  order(router);

  return router;
};
