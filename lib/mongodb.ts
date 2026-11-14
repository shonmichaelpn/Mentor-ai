import mongoose from "mongoose";

let cached = (global as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}).mongoose;

if (!cached) {
  cached = {
    conn: null,
    promise: null,
  };

  (global as typeof globalThis & {
    mongoose?: typeof cached;
  }).mongoose = cached;
}

export async function connectDB() {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("MONGODB_URI environment variable is required");
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(mongodbUri);
  }

  cached!.conn = await cached!.promise;

  return cached!.conn;
}