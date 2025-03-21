import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().nonempty(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});

export { RegisterSchema, LoginSchema };
