import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { LoginResponse, LoginUserType, RegisterResponse, UserType } from "../types";

const registerUser = async (creds: UserType): Promise<RegisterResponse> => {
  const { firstName, lastName, email, password, profileImg } = creds;
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
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImg,
    });
    await user.save();
    if (user) {
      return {
        user: {
          name: user.firstName + user.lastName,
          email: user.email,
          profileImg: user.profileImg,
        },
        err: false,
        msg: "User created",
      };
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

const loginUser = async (creds: LoginUserType): Promise<LoginResponse> => {
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
      const passMatch = await bcryptjs.compare(password, userExist.password);
      if (!passMatch) {
        return { user: {}, token: "", err: true, msg: "Check password" };
      }
      let token;
      if (process.env.JWT_SECRET) {
        token = jwt.sign(
          {
            id: userExist.id,
          },
          process.env["JWT_SECRET"],
          { expiresIn: 60 * 60 }
        );
      }
      if (token) {
        return {
          user: {
            id: userExist.id,
            name: userExist.firstName + " " + userExist.lastName,
            email: userExist.email,
            profileImg:userExist.profileImg
          },
          token,
          err: false,
          msg: "Logged in",
        };
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
