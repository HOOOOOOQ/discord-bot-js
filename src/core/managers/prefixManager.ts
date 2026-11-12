import { getCollections } from "../database/db.js";

const prefixCache = new Map<string, string | null>();

export async function getPrefix(guildId: string): Promise<string | null> {
  if (prefixCache.has(guildId)) {
    return prefixCache.get(guildId) ?? null;
  }

  const doc = await getCollections().guildPrefixes.findOne({ _id: guildId });

  if (!doc) {
    prefixCache.set(guildId, null);
    return null;
  }

  prefixCache.set(guildId, doc.prefix);
  return doc.prefix;
}

export async function setPrefix(
  guildId: string,
  prefix: string
): Promise<void> {
  await getCollections().guildPrefixes.updateOne(
    { _id: guildId },
    { $set: { prefix } },
    { upsert: true }
  );

  prefixCache.set(guildId, prefix);
}

export function deletePrefixCache(guildId: string): void {
  prefixCache.delete(guildId);
}

export function clearPrefixCache(): void {
  prefixCache.clear();
}
