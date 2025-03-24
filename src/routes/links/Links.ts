import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { createLink } from "../../services/linkService";
import { LinkSchema } from "../../utils/index";
import { auth } from "../../middlewares/auth";
import { CreateLinkType, LinkType } from "../../types";

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

const newLinkParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    LinkSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/",
  auth,
  newLinkParser,
  async (
    req: Request<unknown, unknown, LinkType>,
    res: Response<CreateLinkType>
  ) => {
    try {
      const { link, err, msg } = await createLink(req.body);
      if (!err) {
        res.send({ link, err, msg });
      } else {
        res.status(400).send({ link: {}, err, msg });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({
          link: {},
          err: true,
          msg: "Internal Error " + error.message,
        });
      }
    }
  }
);

router.use(errorMiddleware);

export default router;
