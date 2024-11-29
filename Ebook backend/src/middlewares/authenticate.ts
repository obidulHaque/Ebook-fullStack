import { Request, Response, NextFunction } from "express";

import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { _confiq } from "../config/Config";
import { AuthType } from "../types/authTypes";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "Authorization token is required."));
  }

  try {
    const parsedToken = token.split(" ")[1];
    const decoded = verify(parsedToken, _confiq.jwt as string);
    const _req = req as AuthType;
    _req.userId = decoded.sub as string;

    next();
  } catch (error) {
    return next(createHttpError(501, "authenticate Error"));
  }
};

export default authenticate;
