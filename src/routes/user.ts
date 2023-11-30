import express from "express";

import {
  register,
  login,
  generate_new_access_token,
} from "../controllers/user";

export default (router: express.Router) => {
  router.post("/signup", register);
  router.post("/login", login);
  router.post("/generate-access-token", generate_new_access_token);
};
