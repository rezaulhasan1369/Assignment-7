import { MongoClient } from "mongodb";
import dns from "node:dns";

dns.setServers(["8.8.8.8"]);

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

const client = new MongoClient(uri);

const clientPromise =
  globalForMongo._mongoClientPromise ?? client.connect();

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClientPromise = clientPromise;
}

export default clientPromise;