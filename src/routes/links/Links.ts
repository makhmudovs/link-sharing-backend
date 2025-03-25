import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  createLink,
  deleteLink,
  getLink,
  getLinks,
  updateLink,
} from "../../services/linkService";
import { LinkSchema, updateLinkSchema } from "../../utils/index";
import { auth } from "../../middlewares/auth";
import { CreateLinkResponse, LinkType } from "../../types";

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
    res: Response<CreateLinkResponse>
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

router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const { links, err, msg } = await getLinks(req.body);
    if (!err) {
      res.send({ links, err, msg });
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
});

router.get("/:id", auth, async (req: Request, res: Response) => {
  const linkId = req.params.id;
  try {
    const { link, err, msg } = await getLink(linkId);
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
});

const updateLinkParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    updateLinkSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.put(
  "/:id",
  auth,
  updateLinkParser,
  async (req: Request, res: Response) => {
    const linkId = req.params.id;
    try {
      const { link, err, msg } = await updateLink(linkId, req.body);
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

router.delete('/:id',auth,async (req:Request,res:Response)=>{
  const linkId = req.params.id;
    try {
      const { err, msg } = await deleteLink(linkId, req.body);
      if (!err) {
        res.send({ err, msg });
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
})

router.use(errorMiddleware);

export default router;
