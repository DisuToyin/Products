import { body } from "express-validator";

export const cr_product_validation_rules = [
  body("name").exists().withMessage("product name is required"),

  body("price")
    .isNumeric()
    .withMessage("Price must be a numeric value")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0")
    .exists()
    .withMessage("Product price is required"),
];
