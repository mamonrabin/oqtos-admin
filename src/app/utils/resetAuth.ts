/* eslint-disable @typescript-eslint/no-unused-vars */
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import type { NextFunction, Request, Response } from "express";

export const resetAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      config.jwt_acess_token_secret as string
    );

    if (typeof decoded === "string") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = decoded as JwtPayload;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired reset token",
    });
  }
};