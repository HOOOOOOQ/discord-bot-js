import { Events } from "discord.js";
import { env } from "../core/config/env.js";
import { Event } from "../core/types/Event.js";

const event: Event = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user?.tag}`);

    if (client.user && client.user.id !== env.CLIENT_ID) {
      console.warn(
        `CLIENT_ID (${env.CLIENT_ID}) does not match the logged-in bot ID (${client.user.id}). Slash command deploy will fail. Set CLIENT_ID=${client.user.id}`
      );
    }

    if (env.DEV_GUILD_ID && !client.guilds.cache.has(env.DEV_GUILD_ID)) {
      console.warn(
        `DEV_GUILD_ID ${env.DEV_GUILD_ID} is not a server this bot is in. Invite the bot first, or fix the server ID.`
      );
      console.warn(
        `Invite URL: https://discord.com/oauth2/authorize?client_id=${env.CLIENT_ID}&scope=bot%20applications.commands&permissions=68608`
      );
    }
  },
};

export default event;
