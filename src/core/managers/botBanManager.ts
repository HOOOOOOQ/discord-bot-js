import { getCollections } from "../database/db.js";

const bannedUserCache = new Map<string, string | null>();
const bannedGuildCache = new Map<string, string | null>();

function formatReason(reason: string | null | undefined): string {
  return reason ? String(reason) : "No reason provided.";
}

export async function getUserBanReason(userId: string): Promise<string | null> {
  if (bannedUserCache.has(userId)) {
    return bannedUserCache.get(userId) ?? null;
  }

  const doc = await getCollections().bannedUsers.findOne({ _id: userId });

  if (!doc) {
    bannedUserCache.set(userId, null);
    return null;
  }

  const reason = formatReason(doc.reason);
  bannedUserCache.set(userId, reason);
  return reason;
}

export async function getGuildBanReason(
  guildId: string
): Promise<string | null> {
  if (bannedGuildCache.has(guildId)) {
    return bannedGuildCache.get(guildId) ?? null;
  }

  const doc = await getCollections().bannedGuilds.findOne({ _id: guildId });

  if (!doc) {
    bannedGuildCache.set(guildId, null);
    return null;
  }

  const reason = formatReason(doc.reason);
  bannedGuildCache.set(guildId, reason);
  return reason;
}

export async function banUser(
  userId: string,
  reason: string | null = null
): Promise<void> {
  await getCollections().bannedUsers.updateOne(
    { _id: userId },
    { $set: { reason } },
    { upsert: true }
  );

  bannedUserCache.set(userId, reason ?? "No reason provided.");
}

export async function unbanUser(userId: string): Promise<void> {
  await getCollections().bannedUsers.deleteOne({ _id: userId });
  bannedUserCache.delete(userId);
}

export async function banGuild(
  guildId: string,
  reason: string | null = null
): Promise<void> {
  await getCollections().bannedGuilds.updateOne(
    { _id: guildId },
    { $set: { reason } },
    { upsert: true }
  );

  bannedGuildCache.set(guildId, reason ?? "No reason provided.");
}

export async function unbanGuild(guildId: string): Promise<void> {
  await getCollections().bannedGuilds.deleteOne({ _id: guildId });
  bannedGuildCache.delete(guildId);
}

export function clearBotBanCaches(): void {
  bannedUserCache.clear();
  bannedGuildCache.clear();
}
