import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";
const client = uri ? new MongoClient(uri) : null;

export async function getMongoDb(): Promise<Db | null> {
  if (!uri) {
    return null;
  }

  try {
    if (!client) return null;
    await client.connect();
    return client.db();
  } catch {
    return null;
  }
}

export async function closeMongoDb() {
  if (client) {
    await client.close();
  }
}
