import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { LoginType, LoginUserType, RegisterType, UserType } from "../types";

const registerUser = async (creds: UserType): Promise<RegisterType> => {
  const { name, email, password } = creds;
  console.log(name, email, password);
  const userExist = await User.findOne({ email });
  if (userExist) {
    return {
      user: {},
      err: true,
      msg: "User with this email already registered",
    };
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    if (user) {
      return { user, err: false, msg: "User created" };
    } else {
      return { user: {}, err: true, msg: "Error saving user" };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      return { user: {}, err: true, msg: "Error creating user" };
    }
  }

  return { user: {}, err: true, msg: "Unknown error occurred" };
};

const loginUser = async (creds: LoginUserType): Promise<LoginType> => {
  const { email, password } = creds;

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return {
        user: {},
        token: "",
        err: true,
        msg: "User doesn't exist please register",
      };
    }

    if (userExist.password) {
      console.log({ userpass: userExist.password, password: password });
      const passMatch = await bcryptjs.compare(password, userExist.password);
      if (!passMatch) {
        return { user: {}, token: "", err: true, msg: "Check password" };
      }
      let token;
      if (process.env.JWT_SECRET) {
        token = jwt.sign(
          {
            user: userExist._id,
          },
          process.env["JWT_SECRET"],
          { expiresIn: 60 * 60 }
        );
      }
      if (token) {
        return { user: userExist, token, err: false, msg: "Logged in" };
      } else {
        return {
          user: {},
          token: "",
          err: true,
          msg: "Error generating token",
        };
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      return { user: {}, token: "", err: true, msg: "Error creating user" };
    }
  }

  return { user: {}, token: "", err: true, msg: "Unknown error occurred" };
};

export { registerUser, loginUser };
