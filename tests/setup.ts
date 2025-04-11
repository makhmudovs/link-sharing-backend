import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { connectDb } from "../src/db/index";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start the in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Override the MONGODB_URI environment variable for tests
  process.env.MONGODB_URI = uri;

  // Use the connectDb function to connect to the in-memory database
  await connectDb();
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  // Disconnect Mongoose and stop the in-memory server
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
