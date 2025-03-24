import { z } from "zod";
import { RegisterSchema, LoginSchema,LinkSchema } from "./utils/index";

export interface RegisterType {
  user: object;
  err: boolean;
  msg: string;
}

export interface LoginType {
  user: object;
  token:string;
  err: boolean;
  msg: string;
}

export interface CreateLinkType {
  link: object;
  err: boolean;
  msg: string;
}


export type UserType = z.infer<typeof RegisterSchema>;

export type LoginUserType = z.infer<typeof LoginSchema>;

export type LinkType = z.infer<typeof LinkSchema>;
