import { z } from "zod";

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

const RegisterSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email().nonempty(),
  password: z
    .string()
    .nonempty()
    .regex(passwordValidation, { message: "You password is not valid" }),
  profileImg: z.string().nonempty(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .nonempty()
    .regex(passwordValidation, { message: "You password is not valid" }),
});

const LinkSchema = z.object({
  link: z.string().nonempty(),
  owner: z.string().nonempty(),
  platform: z.string().nonempty(),
  user: z.object({
    _id: z.string(),
  }),
});

const getLinksSchema = z.object({
  user: z.object({
    _id: z.string(),
  }),
});

const updateLinkSchema = z.object({
  link: z.string().nonempty(),
  platform: z.string().nonempty(),
  user: z.object({
    _id: z.string(),
  }),
});


export {
  RegisterSchema,
  LoginSchema,
  LinkSchema,
  getLinksSchema,
  updateLinkSchema,
};
