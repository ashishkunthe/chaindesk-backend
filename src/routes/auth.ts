import { Router } from "express";
import { signinTypes, signupTypes } from "../types/auth";
import { User } from "../model/User";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const route = Router();

route.post("/auth/signup", async (req, res) => {
  const input = signupTypes.safeParse(req.body);

  if (!input.success) {
    return res.json({ message: "Invalid inputs" });
  }

  try {
    const { username, email, password } = input.data;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: passwordHashed,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({
      message: "user registred",
      token: token,
    });
  } catch (error) {
    console.log("User registration error", error);
    res.json({
      message: "something went wrong",
      statusCode: 500,
    });
  }
});

route.post("/auth/signin", async (req, res) => {
  const input = signinTypes.safeParse(req.body);

  if (!input.success) {
    return res.json({ message: "Invalid inputs" });
  }

  try {
    const { email, password } = input.data;

    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.json({
        message: "user is not registered,please create account",
      });
    }

    const passwordCompare = await bcrypt.compare(password, findUser.password);

    if (!passwordCompare) {
      return res.json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: findUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({
      message: "sigin successful",
      token: token,
    });
  } catch (error) {
    console.log("error in signin", error);
    res.json({
      message: "error signing in",
    });
  }
});

export default route;
