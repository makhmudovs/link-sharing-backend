import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILink extends Document {
  url: string;
  owner: Types.ObjectId;
  platform: string;
}

const linkSchema = new Schema<ILink>(
  {
    url: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      required: true,
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

export const Link = mongoose.model<ILink>("Link", linkSchema);
