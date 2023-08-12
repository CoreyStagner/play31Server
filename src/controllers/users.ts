import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import { requiresAuth } from "../middleware/auth";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {

  try {
    requiresAuth;
    const user = await UserModel.findById(req.session.userId)
      .select("+email")
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const { username, email, password: passwordRaw } = req.body;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Parameters are missing");
    }
    // Check to make sure that the username is unique
    const existingUserName = await UserModel.findOne({
      username: username,
    }).exec();
    if (existingUserName) {
      throw createHttpError(
        409,
        "Username already exists. Please choose a different one or log in instead."
      );
    }

    // Check to make sure that the email is unique
    const existingEmail = await UserModel.findOne({ email: email }).exec();
    if (existingEmail) {
      throw createHttpError(
        409,
        "email already exists. Please choose a different one or log in instead."
      );
    }

    // Hash Password
    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username,
      email,
      password: passwordHashed,
    });

    req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}
export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Username or Password is missing");
    }

    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
