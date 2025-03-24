import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { loginUser, registerUser } from "../../services/userService";
import { LoginSchema, RegisterSchema } from "../../utils/index";
import { LoginType, LoginUserType, RegisterType, UserType } from "../../types";

const router = express.Router();

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

const newUserParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    RegisterSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/register",
  newUserParser,
  async (
    req: Request<unknown, unknown, UserType>,
    res: Response<RegisterType>
  ) => {
    const { user, err, msg } = await registerUser(req.body);
    if (!err) {
      res.send({ user, err, msg });
    } else {
      res.status(400).send({ user, err, msg });
    }
  }
);

const loginUserParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    LoginSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/login",
  loginUserParser,
  async (
    req: Request<unknown, unknown, LoginUserType>,
    res: Response<LoginType>
  ) => {
    const { user, token, err, msg } = await loginUser(req.body);
    
    if (!err) {
      res.send({ user, token, err, msg });
    } else {
      res.status(400).send({ user, err, token, msg });
    }
  }
);

router.use(errorMiddleware);

export default router;
