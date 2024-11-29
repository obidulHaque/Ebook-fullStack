import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { _confiq } from "../config/Config";

const golobalErrorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusError = error.statusCode || 500;
  return res.status(statusError).json({
    message: error.message,
    errorStack: _confiq.env === "development" ? error.stack : "",
  });
};
export default golobalErrorHandler;
