import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { _confiq } from "../config/Config";
import { user } from "../types/userTypes";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // Database call.
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        "User already exists with this email."
      );
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting user"));
  }

  /// password -> hash

  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: user;
  try {
    newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while creating user."));
  }

  try {
    // Token generation JWT
    const Token = sign({ sub: newUser._id }, _confiq.jwt as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
    // Response
    res.status(201).json({ accessToken: Token });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
};

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const emailExist = await userModel.findOne({ email });
    if (!emailExist) {
      return next(createHttpError(500, "Email doesn't exist"));
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      emailExist.password
    );
    if (!isPasswordCorrect) {
      return next(createHttpError(500, "email and password wrong "));
    }
    const Token = sign({ sub: emailExist._id }, _confiq.jwt as string, {
      expiresIn: "7d",
    });

    res.status(201).json({ accessToken: Token });
  } catch (error) {
    return next(createHttpError(501, "Login Error "));
  }
};
