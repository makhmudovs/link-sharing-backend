import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  profileImg?: string;
  links?: string[];
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true, // Changed to optional (false) for test
    },
    lastName: {
      type: String,
      required: true, // Changed to optional (false) for test
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profileImg: {
      type: String,
      required: true, // Changed to optional (false) for test
    },
    links: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const User = mongoose.model<IUser>('User', userSchema);