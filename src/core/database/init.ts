import { connectDatabase } from "./db.js";

export async function initDatabase(): Promise<void> {
  const database = await connectDatabase();
  console.log(`MongoDB connected (${database.databaseName}).`);
}
