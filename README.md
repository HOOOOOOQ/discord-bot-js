# Discord Bot JS

> ⚠️ **This repository is a template.**  
> Before running the bot you must configure the `.env` file with your own values.

![Node.js](https://img.shields.io/badge/node-22+-green)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)
![Database](https://img.shields.io/badge/database-MongoDB-green)
![Docker](https://img.shields.io/badge/docker-supported-blue)

A modular **Discord bot template** built with:

- Node.js
- TypeScript
- discord.js
- MongoDB (connection URL / Atlas)
- Docker / Portainer support

This template is designed to be reused for **multiple bots**.

> **MongoDB and Docker are optional.** The bot can run directly from Windows
> Command Prompt with Node.js. Set `DATABASE_ENABLED=false` and only a Discord
> token plus client ID are required. To persist prefixes, bans, permissions,
> and terms, set `DATABASE_ENABLED=true` and provide `MONGODB_URI`.

---

# Features

- Slash commands
- Prefix commands
- Optional MongoDB database (Atlas or any MongoDB URL)
- Automatic MongoDB connection when enabled
- Per-guild prefix system
- Cooldown system
- Bot owner system
- Guild owner checks
- Discord permission checks
- Custom bot permission levels
- Bot terms system
- Bot user ban system
- Docker / Portainer support
- Modular architecture

---

# Project Structure

```
src
│
├── app.ts
│
├── core
│   ├── client
│   ├── config
│   ├── database
│   ├── guards
│   ├── loaders
│   ├── managers
│   ├── types
│   └── utils
│
├── commands
│   ├── prefix
│   └── slash
│
├── events
│
└── deploy
```

---

# Quick Start

Run the bot quickly:

```
git clone https://github.com/DemirK2/discord-bot-js.git
cd discord-bot-js
npm ci
```

Copy the environment file on Windows Command Prompt:

```bat
copy .env.example .env
```

On macOS or Linux:

```sh
cp .env.example .env
```

For the simplest setup, edit only these values in `.env`:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
DATABASE_ENABLED=false
```

If you already have a MongoDB URL (Atlas or local), enable persistence:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
DATABASE_ENABLED=true
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/discordbot
```

Then run:

```
npm run deploy
npm run dev
```

Your bot should now be online.

---

# Installation

The bot can run in three ways:

- Local Node.js
- Docker
- Portainer

| Setup | Docker required | MongoDB required | Persistent features |
|---|---:|---:|---|
| Basic local bot | No | No | No |
| Local bot with MongoDB URL | No | Yes | Yes |
| Docker Compose | Yes | Your MongoDB URL | Yes |

---

# Installation Without Docker (Local / Windows)

Clone the repository:

```
git clone https://github.com/DemirK2/discord-bot-js.git
cd discord-bot-js
```

Install dependencies:

```
npm ci
```

Copy the environment file:

```bat
copy .env.example .env
```

Example `.env`:

```
DISCORD_TOKEN=
CLIENT_ID=
DEV_GUILD_ID=
BOT_OWNER_IDS=

PREFIX_DEFAULT=!

DATABASE_ENABLED=false
MONGODB_URI=
```

With `DATABASE_ENABLED=false`, `MONGODB_URI` may stay empty. The bot will run
with its default prefix and commands that do not require persistent storage.

To enable persistent features, set:

```
DATABASE_ENABLED=true
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/discordbot
```

Include the database name in the URL path (`/discordbot` above). A local
MongoDB URL such as `mongodb://127.0.0.1:27017/discordbot` also works.

Start the bot:

```
npm run dev
```

Production:

```
npm run build
npm start
```

Deploy commands:

```
npm run deploy
```

---

# Installation With Docker

Clone the repository:

```
git clone https://github.com/DemirK2/discord-bot-js.git
cd discord-bot-js
```

Copy environment file:

```sh
cp .env.example .env
```

Edit `.env`:

```
DISCORD_TOKEN=
CLIENT_ID=
DEV_GUILD_ID=
BOT_OWNER_IDS=

PREFIX_DEFAULT=!

DATABASE_ENABLED=true
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/discordbot
```

Start containers:

```
docker compose up -d --build
```

This starts the bot and connects it to MongoDB using `MONGODB_URI`. Compose
defaults `DATABASE_ENABLED` to `true` for the bot container.

---

# Optional Database Features

MongoDB is not required for the basic bot. With `DATABASE_ENABLED=false`:

- slash and prefix commands such as `ping` work
- the prefix comes from `PREFIX_DEFAULT`
- `/terms view` works
- no MongoDB server or Atlas cluster is needed

Database-dependent commands remain registered so the template API stays
consistent, but they reply that the database must be enabled instead of
crashing the bot.

The following persistent features require `DATABASE_ENABLED=true` and a
valid `MONGODB_URI`:

- per-server custom prefixes and `/setprefix`
- bot user and guild bans
- custom bot permission levels
- recording terms acceptance with `/terms accept`

To enable them, set:

```env
DATABASE_ENABLED=true
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/discordbot
```

The bot connects to MongoDB when it starts and creates collections on first
write. Switching back to `DATABASE_ENABLED=false` disables database access
without deleting existing MongoDB data.

---

# Installation With Portainer

Portainer must have access to the repository files because the included
Compose file uses `build: .`. If you use Portainer Business Edition, you can
create the stack from the Git repository. For Portainer Community Edition,
build a local image on the Docker host as described below.

## Raspberry Pi + Portainer Community Edition

Connect to the Raspberry Pi over SSH and clone the repository:

```sh
git clone https://github.com/DemirK2/discord-bot-js.git
cd discord-bot-js
```

Build an image for the Raspberry Pi:

```sh
docker build -t discord-bot-js:local .
```

In Portainer:

1. Open **Stacks** and select **Add stack**.
2. Name the stack `discord-bot`.
3. Select **Web editor**.
4. Paste the contents of `docker-compose.yml`.
5. Replace `build: .` and `pull_policy: build` in the `bot` service with:

```yaml
image: discord-bot-js:local
```

Add these values in the stack's **Environment variables** section:

```
DISCORD_TOKEN
CLIENT_ID
DEV_GUILD_ID
BOT_OWNER_IDS
DATABASE_ENABLED
MONGODB_URI
```

Keep the Discord token and the MongoDB URL out of the Compose file and Git
repository. If the MongoDB password contains special characters, URL-encode
them in `MONGODB_URI`.

Select **Deploy the stack**. The bot should become `running`. The bot logs
should contain:

```text
MongoDB connected.
Logged in as YourBotName
```

The Docker image contains the production bot but not the development tools
used by `npm run deploy`. Deploy slash commands once from a cloned copy of the
repository on your Windows, macOS, or Linux computer:

```sh
npm ci
npm run deploy
```

Run this again only after adding, removing, or changing slash commands.

### Updating the Raspberry Pi deployment

Pull and rebuild the image over SSH:

```sh
cd discord-bot-js
git pull
docker build -t discord-bot-js:local .
```

Then recreate the bot container from Portainer without pulling the image from
a registry. Persistent data stays in your MongoDB cluster or server.

Portainer Business Edition users can instead select **Git repository** while
creating the stack and point it at the repository containing
`docker-compose.yml`.

---

# Inviting the Bot

To invite the bot to your server:

Get your **Client ID** from the Discord Developer Portal.

If you want to use prefix commands, open your application in the Developer
Portal, go to **Bot → Privileged Gateway Intents**, and enable
**Message Content Intent**.

Invite link format:

```
https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot%20applications.commands&permissions=68608
```

Replace `CLIENT_ID` with your actual client ID.
The example requests only View Channels, Send Messages, and Read Message
History. Add further permissions only when your own commands need them.

---

# Creating a Slash Command

Create a file in:

```
src/commands/slash/general/
```

Example:

```
template.ts
```

Example command:

```ts
import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../core/types/Command.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("template")
    .setDescription("Example slash command"),

  cooldown: 5,

  async execute(client, interaction) {
    void client;
    await interaction.reply({
      content: "Template command executed.",
      ephemeral: true,
    });
  },
};

export default command;
```

---

# Creating a Prefix Command

Create a file in:

```
src/commands/prefix/general/
```

Example:

```
template.ts
```

Example command:

```ts
import { PrefixCommand } from "../../../core/types/Command.js";

const command: PrefixCommand = {
  name: "template",
  aliases: ["t"],

  cooldown: 5,

  async execute(client, message, args) {
    void client;
    void args;
    await message.reply("Template prefix command executed.");
  },
};

export default command;
```

---

# Creating an Event

Create a file in:

```
src/events/
```

Example:

```
guildCreate.ts
```

Example event:

```ts
import { Event } from "../core/types/Event.js";

const event: Event = {
  name: "guildCreate",

  async execute(client, guild) {
    void client;
    console.log(`Joined new guild: ${guild.name}`);
  },
};

export default event;
```

---

# Using the Database

MongoDB connection is handled automatically when `DATABASE_ENABLED=true`.

Access it via:

```
src/core/database/db.ts
```

Example from a command inside `src/commands/slash/general/`:

```ts
import { getCollections } from "../../../core/database/db.js";

await getCollections().guildPrefixes.updateOne(
  { _id: guildId },
  { $set: { prefix } },
  { upsert: true }
);
```

Relative import paths change depending on the location of your file. Calling
`getCollections()` while the database is disconnected throws an error, so
database-backed commands should check `DATABASE_ENABLED` or use the existing
managers and guards.

Include the database name in `MONGODB_URI`:

```
mongodb+srv://user:password@cluster.mongodb.net/discordbot
mongodb://127.0.0.1:27017/discordbot
```

---

# Bot Permission System

Users can have custom permission levels.

| Level | Meaning |
|------|--------|
| 0 | normal user |
| 3 | moderator |
| 5 | admin |
| 10 | high-level admin (example) |

Example restriction:

```
botPermissions: 5
```

User must have permission level **5 or higher**.

Custom permission levels require MongoDB. They do not make someone a bot
owner. Bot owners are configured separately with `BOT_OWNER_IDS` in `.env`.

---

# Bot Ban System

Users can be banned from using the bot.

The included `/botban` command manages user bans. Guild ban support exists in
`botBanManager`, but the template does not include a `/guildban` command.

Commands:

```
/botban userID
```

Check ban status.

```
/botban userID reason
```

Toggle ban/unban.

---

# Bot Terms System

Users can view and accept the example terms with:

```
/terms view
/terms accept
```

Replace the example terms with terms appropriate for your own bot before
publishing it.

---

# Cooldown System

Commands can define cooldowns.

Example:

```
cooldown: 10
```

Users must wait **10 seconds** before using the command again.

---

# Command Restrictions

Commands support several restrictions.

Example:

```ts
guildOnly: true,
guildOwnerOnly: true,
botOwnerOnly: true,
permissions: [PermissionFlagsBits.Administrator],
botPermissions: 5,
botTerms: true,
```

These options are examples and do not all need to be used together. Do not set
both `guildOnly` and `dmOnly` on the same command. `botPermissions` and
`botTerms` require the database to be enabled.

---

# Available Restrictions

| Option | Description |
|------|-------------|
| cooldown | command cooldown |
| guildOnly | server only |
| dmOnly | DM only |
| guildOwnerOnly | only server owner |
| botOwnerOnly | only bot owners |
| permissions | Discord permissions |
| botPermissions | custom permission level |
| botTerms | requires terms acceptance |

---

# Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run the TypeScript source in development mode |
| `npm run deploy` | Deploy slash commands to the dev guild or globally |
| `npm run typecheck` | Check TypeScript types without creating build files |
| `npm run lint` | Check source and test files with ESLint |
| `npm test` | Build the project and run automated tests |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Run the compiled production build |

Use `npm ci` after cloning the repository. Use `npm install <package>` when
adding a new dependency.

---

# Troubleshooting

## Slash commands not appearing

Run:

```
npm run deploy
```

If using `DEV_GUILD_ID`, commands appear instantly in that server.

When `DEV_GUILD_ID` is set, deployment targets only that server. Remove it to
deploy commands globally. Global commands may take up to **1 hour** to appear.

---

## Bot not starting

Check your `.env` file and verify:

```
DISCORD_TOKEN
CLIENT_ID
```

---

## Database errors

First verify that `DATABASE_ENABLED=true`. Then check `MONGODB_URI`:

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/discordbot
```

The URL must start with `mongodb://` or `mongodb+srv://` and should include
the database name. If the password has special characters (`@`, `#`, `/`,
etc.), URL-encode them. If you do not need persistent features, set
`DATABASE_ENABLED=false` when running locally.

---

# FAQ

## Are MongoDB and Docker required?

No. For a basic local bot, set `DATABASE_ENABLED=false` and run it directly
with Node.js. MongoDB is required only for persistent prefixes, bans, custom
permission levels, and terms acceptance. Provide that as `MONGODB_URI`
(Atlas or a local MongoDB server). Docker is an optional deployment method.

## Can I run the bot from Windows Command Prompt?

Yes. Install Node.js 22 or newer, clone the repository, copy `.env.example` to
`.env`, run `npm ci`, and then use `npm run deploy` followed by `npm run dev`.

## What is the difference between `npm ci` and `npm install`?

`npm ci` installs the exact dependency versions from `package-lock.json` and
is recommended after cloning. Use `npm install <package>` when adding a new
dependency.

## Why are slash commands not visible?

Run `npm run deploy`. When `DEV_GUILD_ID` is set, commands are deployed only
to that server. Without it, commands are deployed globally and may take time
to appear.

## Why do prefix commands not work?

Enable **Message Content Intent** under **Bot → Privileged Gateway Intents**
in the Discord Developer Portal. Also verify `PREFIX_DEFAULT` and the bot's
channel permissions.

## Why does `/terms` require another option?

Discord requires a subcommand because the template defines them. Use
`/terms view` to read the terms or `/terms accept` to record acceptance.
Acceptance requires MongoDB.

## Why does Portainer report that it cannot find the Dockerfile?

The Compose setting `build: .` requires the complete repository as its build
context. With Portainer Community Edition, build `discord-bot-js:local` on the
Docker host and use that image in the stack. Portainer Business Edition can
deploy the stack from its Git repository option.

## Does the bot support Raspberry Pi?

The Dockerfile uses ARM-compatible official Node.js images. A 64-bit
Raspberry Pi OS installation is recommended. Building the image on the Pi
automatically selects its architecture. MongoDB data lives in the cluster or
server pointed to by `MONGODB_URI`, not in the bot container.

## Will recreating the bot container delete the data?

No. Persistent data is stored in MongoDB through `MONGODB_URI`. Recreating
the bot container does not delete Atlas or MongoDB server data.

## What should I do if a Discord token is committed to GitHub?

Immediately reset the token in the Discord Developer Portal, update the local
`.env`, and remove the secret from the repository history. Deleting only the
visible line from the latest commit is not sufficient.

---

# Creating a New Bot From This Template

Click **Use this template** on GitHub and create a new repository.

Clone your new bot:

```
git clone https://github.com/YOUR_USERNAME/YOUR_NEW_BOT.git
```

---

# Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a branch
3. Make your changes
4. Open a pull request

---

# Support

If you encounter issues:

1. Check the **Troubleshooting** section
2. Search existing issues
3. Create a new issue if needed

Include:

- Node.js version
- OS
- Error message
- Steps to reproduce

---

# License

MIT
