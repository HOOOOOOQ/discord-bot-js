function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function snowflake(name: string, value: string): string {
  if (!/^\d{17,20}$/.test(value)) {
    throw new Error(`Invalid Discord ID in environment variable: ${name}`);
  }
  return value;
}

function boolean(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (!value) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${name} must be either true or false`);
}

function mongoUri(name: string): string {
  const value = required(name);
  if (!/^mongodb(\+srv)?:\/\//.test(value)) {
    throw new Error(
      `${name} must start with mongodb:// or mongodb+srv://`
    );
  }
  return value;
}

const defaultPrefix = process.env.PREFIX_DEFAULT || "!";
if (defaultPrefix.length > 10) {
  throw new Error("PREFIX_DEFAULT must be at most 10 characters long");
}

const databaseEnabled = boolean("DATABASE_ENABLED", false);

export const env = {
  DISCORD_TOKEN: required("DISCORD_TOKEN"),
  CLIENT_ID: snowflake("CLIENT_ID", required("CLIENT_ID")),

  DEV_GUILD_ID: process.env.DEV_GUILD_ID
    ? snowflake("DEV_GUILD_ID", process.env.DEV_GUILD_ID)
    : null,

  BOT_OWNER_IDS: (process.env.BOT_OWNER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => snowflake("BOT_OWNER_IDS", id)),

  PREFIX_DEFAULT: defaultPrefix,

  DATABASE_ENABLED: databaseEnabled,
  MONGODB_URI: databaseEnabled ? mongoUri("MONGODB_URI") : "",
};
