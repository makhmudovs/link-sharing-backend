import { Response } from "express";
import { Link } from "../models/Links";
import { CreateLinkSchema, GetLinksSchema } from "../types";
import { AuthRequest } from "../middlewares/auth";

export const createLink = async (req: AuthRequest, res: Response) => {
  try {
    const { url, platform } = CreateLinkSchema.parse(req.body);
    const user = req.user;

    const link = new Link({ url, owner: user!._id, platform });
    await link.save();

    res.status(201).json({ message: "Link created", link });
  } catch (error) {
    res.status(500).json({ message: "Error creating link", error });
  }
};

export const getLinks = async (req: AuthRequest, res: Response) => {
  try {
    const validatedReq = GetLinksSchema.parse({
      user: req.user,
      query: req.query,
    });
    const { user } = validatedReq;
    const { page, limit } = validatedReq.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      throw new Error("Invalid page or limit value");
    }

    const skip = (pageNum - 1) * limitNum;

    const links = await Link.find({ owner: user._id })
      .limit(limitNum)
      .skip(skip);

    res.json(links);
  } catch (error) {
    res.status(500).json({ message: "Error fetching links", error });
  }
};
