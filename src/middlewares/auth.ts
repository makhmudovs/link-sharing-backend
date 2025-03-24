import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export const auth = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const auth = req ? req.headers.authorization : null;
    const jwtSecret: string = process.env.JWT_SECRET as string;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        jwtSecret
      ) as CustomJwtPayload;
      const currentUser = await User.findById(decodedToken.id);
      if (currentUser) {
        req.body.user = {
          _id: currentUser._id.toString(), // Convert ObjectId to string
        };
        next();
      } else {
        res.status(404).send("User not found");
      }
    }
  } catch (error) {
    res.status(401).send("Please authenticate");
  }
};
