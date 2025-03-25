import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLengh: 8,
    },
    profileImg: {
      type: String,
      required: true,
    },
    links: {
      type:Array,
      default:[]
    },
    createdAt: {
      type: String,
      default: new Date(),
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

export default User;
