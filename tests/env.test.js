import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import process from "node:process";
import { test } from "node:test";

function loadEnv(extraEnv = {}) {
  return spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      'import("./dist/core/config/env.js").then(({ env }) => console.log(JSON.stringify({ DATABASE_ENABLED: env.DATABASE_ENABLED, MONGODB_URI: env.MONGODB_URI })))',
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        PATH: process.env.PATH,
        DISCORD_TOKEN: "test-token",
        CLIENT_ID: "12345678901234567",
        ...extraEnv,
      },
    }
  );
}

test("loads configuration without database credentials by default", () => {
  const result = loadEnv();

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    DATABASE_ENABLED: false,
    MONGODB_URI: "",
  });
});

test("requires a MongoDB URL when the database is enabled", () => {
  const result = loadEnv({ DATABASE_ENABLED: "true" });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing environment variable: MONGODB_URI/);
});

test("rejects a non-MongoDB URL", () => {
  const result = loadEnv({
    DATABASE_ENABLED: "true",
    MONGODB_URI: "postgres://localhost/discordbot",
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must start with mongodb:\/\/ or mongodb\+srv:\/\//);
});

test("accepts a MongoDB Atlas URL", () => {
  const result = loadEnv({
    DATABASE_ENABLED: "true",
    MONGODB_URI:
      "mongodb+srv://user:password@cluster.mongodb.net/discordbot",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    DATABASE_ENABLED: true,
    MONGODB_URI: "mongodb+srv://user:password@cluster.mongodb.net/discordbot",
  });
});
