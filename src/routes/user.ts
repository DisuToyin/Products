import express from "express";

import {
  register,
  login,
  generate_new_access_token,
} from "../controllers/user";

import { validate_request } from "../middlewares/request_validator";

import { signup_login_val_rule } from "../rules/user";

export default (router: express.Router) => {
  router.post("/signup", signup_login_val_rule, validate_request, register);
  router.post("/login", signup_login_val_rule, validate_request, login);
  router.post("/generate-access-token", generate_new_access_token);
};
