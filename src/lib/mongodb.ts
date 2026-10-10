import { MongoClient } from "mongodb";
import dns from "node:dns";

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

export default function getMongoClient(): Promise<MongoClient> {
  if (!globalForMongo._mongoClientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is missing from the server environment");
    if (process.env.NODE_ENV === "development") dns.setServers(["8.8.8.8"]);
    const client = new MongoClient(uri);
    globalForMongo._mongoClientPromise = client.connect().catch(async (error) => {
      globalForMongo._mongoClientPromise = undefined;
      await client.close().catch(() => {});
      throw error;
    });
  }
  return globalForMongo._mongoClientPromise;
}
