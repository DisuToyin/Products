import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { success_response, error_response } from "../utils/response_handler";
import { create_new_user, find_user } from "../services/user";

export const register = async (req: Request, res: Response) => {
  try {
    const new_user = await create_new_user(req.body);
    const token = new_user.accessToken();
    const refresh_token = new_user.refreshToken();

    const response = { token, user: new_user };
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      //   sameSite: "None",
      //   secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    success_response(res, 201, response);
  } catch (err) {
    console.log("---------");
    let data = "Internal Server Error";
    let status = 500;
    if (err?.code === 11000) {
      data = "Email already exists!";
      status = 400;
    }
    console.log(err?.code, err);
    return error_response(res, status, data);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await find_user("email", email);
    if (!user)
      return error_response(
        res,
        401,
        "Invalid credentials",
        "The provided email or password is incorrect."
      );

    if (user && !user.password) {
      return error_response(
        res,
        401,
        "Invalid credentials",
        "The provided email or password is incorrect."
      );
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      const signed_in_user = await find_user("id", user._id);
      const token = signed_in_user.accessToken();
      const refresh_token = signed_in_user.refreshToken();
      const response = { token, user: signed_in_user };
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return success_response(res, 200, response);
    } else {
      return error_response(
        res,
        401,
        "Invalid credentials",
        "The provided email or password is incorrect."
      );
    }
  } catch (err) {
    console.log(err);
    return error_response(res, 500, err);
  }
};

export const generate_new_access_token = async (
  req: Request,
  res: Response
) => {
  try {
    const refresh_token = req.cookies?.refresh_token;
    console.log({ refresh_token });
    if (!refresh_token) {
      return error_response(
        res,
        403,
        "Invalid Refresh Token",
        "No refresh token was passed"
      );
    }

    const user = jwt.verify(
      refresh_token,
      "9w83974yurhdbwruhruheryee"
    ) as jwt.JwtPayload;

    if (!user)
      return error_response(res, 404, "Invalid user", "User doesn't exist");

    const found_user = await find_user("id", user.id);

    const token = found_user.accessToken();

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return success_response(
      res,
      200,
      token,
      "Successfully generated new access token"
    );
  } catch (err) {
    console.log(err);
    return error_response(res, err, 500);
  }
};
