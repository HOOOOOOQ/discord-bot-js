import { Db, MongoClient } from "mongodb";
import { env } from "../config/env.js";
import {
  AcceptedTermsDocument,
  BannedGuildDocument,
  BannedUserDocument,
  GuildPrefixDocument,
  UserPermissionDocument,
} from "./types.js";

let client: MongoClient | null = null;
let database: Db | null = null;

function databaseNameFromUri(uri: string): string {
  try {
    const name = new URL(uri).pathname.replace(/^\//, "").trim();
    return name || "discordbot";
  } catch {
    return "discordbot";
  }
}

export async function connectDatabase(): Promise<Db> {
  if (database) return database;

  if (!env.DATABASE_ENABLED) {
    throw new Error(
      "Database is disabled. Set DATABASE_ENABLED=true to use it."
    );
  }

  try {
    client = new MongoClient(env.MONGODB_URI);
    await client.connect();
    database = client.db(databaseNameFromUri(env.MONGODB_URI));
    await database.command({ ping: 1 });
    return database;
  } catch (error) {
    client = null;
    database = null;
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to connect to MongoDB. Check MONGODB_URI. ${message}`,
      { cause: error }
    );
  }
}

export function getDb(): Db {
  if (!database) {
    throw new Error(
      "Database is not connected. Enable it with DATABASE_ENABLED=true and a valid MONGODB_URI."
    );
  }

  return database;
}

export function getCollections() {
  const db = getDb();

  return {
    guildPrefixes: db.collection<GuildPrefixDocument>("guild_prefixes"),
    bannedUsers: db.collection<BannedUserDocument>("bot_banned_users"),
    bannedGuilds: db.collection<BannedGuildDocument>("bot_banned_guilds"),
    userPermissions: db.collection<UserPermissionDocument>("user_bot_permissions"),
    acceptedTerms: db.collection<AcceptedTermsDocument>("accepted_bot_terms"),
  };
}

export async function closeDatabase(): Promise<void> {
  if (!client) return;

  await client.close();
  client = null;
  database = null;
}
