import { body } from "express-validator";

export const order_validation_rules = [
  body("user").isMongoId().exists().withMessage("User is required"),
  body("order_items")
    .isArray({ min: 1 })
    .withMessage("At least one order item is required"),
  body("order_items.*.quantity")
    .isNumeric()
    .withMessage("Quantity must be a number"),
  body("order_items.*.product")
    .isMongoId()
    .exists()
    .withMessage("Product is required for each order item"),
];
