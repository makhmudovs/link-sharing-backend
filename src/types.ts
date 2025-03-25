import { z } from "zod";
import { RegisterSchema, LoginSchema,LinkSchema,getLinksSchema, updateLinkSchema } from "./utils/index";

export interface RegisterResponse {
  user: object;
  err: boolean;
  msg: string;
}

export interface LoginResponse {
  user: object;
  token:string;
  err: boolean;
  msg: string;
}

export interface CreateLinkResponse {
  link: object;
  err: boolean;
  msg: string;
}

export interface GetLinksReponse {
  links: object;
  err: boolean;
  msg: string;
}

export interface GetLinkReponse {
  link: object;
  err: boolean;
  msg: string;
}


export type UserType = z.infer<typeof RegisterSchema>;

export type LoginUserType = z.infer<typeof LoginSchema>;

export type LinkType = z.infer<typeof LinkSchema>;

export type GetLinksType = z.infer<typeof getLinksSchema>;

export type UpdateLinkType = z.infer<typeof updateLinkSchema>;
