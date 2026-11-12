import "dotenv/config";
import { REST, Routes } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { env } from "../core/config/env.js";

function inviteUrl(clientId: string): string {
  return `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot%20applications.commands&permissions=68608`;
}

function errorCode(error: unknown): number | string | null {
  if (typeof error === "object" && error !== null && "code" in error) {
    return (error as { code: number | string }).code;
  }

  return null;
}

function explainDeployError(error: unknown): void {
  const code = errorCode(error);

  if (code === 50001 && env.DEV_GUILD_ID) {
    console.error(`
Missing Access while deploying slash commands to guild ${env.DEV_GUILD_ID}.

The bot token works, but Discord refused to register guild commands. Usually this means:

1. CLIENT_ID is not this bot's Application ID
   Developer Portal → Application → General Information → Application ID
2. The bot is not in that server
3. The bot was invited without the applications.commands scope

Kick the bot if it is already in the server, then re-invite with this URL:

${inviteUrl(env.CLIENT_ID)}

Confirm DEV_GUILD_ID by enabling Discord Developer Mode, then right-click the
server icon → Copy Server ID.
`);
    return;
  }

  if (code === 50001) {
    console.error(`
Missing Access while deploying global slash commands.

Check that CLIENT_ID is the Application ID of the same bot as DISCORD_TOKEN.
`);
    return;
  }

  console.error(error);
}

async function deployCommands(): Promise<void> {
  const commands: any[] = [];

  const basePath = join(process.cwd(), "src", "commands", "slash");
  const categories = readdirSync(basePath);

  for (const category of categories) {
    const categoryPath = join(basePath, category);
    const files = readdirSync(categoryPath).filter((f) => f.endsWith(".ts"));

    for (const file of files) {
      const filePath = join(categoryPath, file);
      const mod = await import(filePath);
      const command = mod.default;

      commands.push(command.data.toJSON());
    }
  }

  const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
  const me = (await rest.get(Routes.user("@me"))) as {
    id: string;
    username: string;
  };

  if (me.id !== env.CLIENT_ID) {
    throw new Error(
      `CLIENT_ID (${env.CLIENT_ID}) does not match DISCORD_TOKEN's bot ID (${me.id}, ${me.username}). Set CLIENT_ID=${me.id}`
    );
  }

  console.log(`Deploying ${commands.length} slash commands...`);

  if (env.DEV_GUILD_ID) {
    console.log(`Deploying to DEV guild: ${env.DEV_GUILD_ID}`);

    await rest.put(
      Routes.applicationGuildCommands(env.CLIENT_ID, env.DEV_GUILD_ID),
      { body: commands }
    );

    console.log("DEV guild commands deployed.");
    return;
  }

  console.log("Deploying global commands...");
  await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
    body: commands,
  });

  console.log("Global commands deployed.");
}

deployCommands().catch((error) => {
  explainDeployError(error);
  process.exitCode = 1;
});
