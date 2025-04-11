import mongoose from "mongoose";

mongoose.set("strictQuery", false);

export const connectDb = async (): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  console.log("connecting to", MONGODB_URI);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connected to MongoDB");
  } catch (error) {
    console.error("error connecting to MongoDB:", (error as Error).message);
    throw error;
  }
};
