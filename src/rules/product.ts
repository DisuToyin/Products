import { body } from "express-validator";

export const cr_product_validation_rules = [
  body("name").exists().withMessage("product name is required"),

  body("price")
    .isNumeric()
    .exists()
    .withMessage("Product is required for each order item"),
];
