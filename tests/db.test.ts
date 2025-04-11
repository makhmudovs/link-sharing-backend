import mongoose from 'mongoose';
import { connectDb } from '../src/db/index';

describe('Database Connection', () => {
  it('should connect to MongoDB successfully', async () => {
    // The connection is already set up in setup.ts, so we can check the state
    expect(mongoose.connection.readyState).toBe(1); // 1 means connected
  });

  it('should throw an error if MONGODB_URI is not defined', async () => {
    // Temporarily unset MONGODB_URI
    const originalUri = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;

    await expect(connectDb()).rejects.toThrow('MONGODB_URI is not defined in environment variables');

    // Restore MONGODB_URI for other tests
    process.env.MONGODB_URI = originalUri;
  });
});