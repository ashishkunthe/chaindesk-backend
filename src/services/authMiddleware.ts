import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface RequestExtended extends Request {
  userId: string;
}

export function authMiddleware(
  req: RequestExtended,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization;

    if (!token) return res.json({ message: "unauthorized" });

    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    if (!decode) return res.json({ message: "invalid credentials" });

    req.userId = decode.userId;
    next();
  } catch (error) {
    console.log("invalid credential");
    res.json({ message: "Invalid credential" });
  }
}
