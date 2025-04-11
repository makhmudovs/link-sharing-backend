import { z } from "zod";

export const RegisterSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  profileImg: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const CreateLinkSchema = z.object({
  url: z.string().url(),
  platform: z.string(),
});

export const GetLinksSchema = z.object({
  user: z.object({
    _id: z.string(),
  }),
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
  }),
});

export type RegisterType = z.infer<typeof RegisterSchema>;
export type LoginType = z.infer<typeof LoginSchema>;
export type CreateLinkType = z.infer<typeof CreateLinkSchema>;
export type GetLinksType = z.infer<typeof GetLinksSchema>;
