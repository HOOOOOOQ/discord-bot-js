import { getCollections } from "../database/db.js";

const termsCache = new Map<string, boolean>();

export async function hasAcceptedBotTerms(userId: string): Promise<boolean> {
  if (termsCache.has(userId)) {
    return termsCache.get(userId)!;
  }

  const doc = await getCollections().acceptedTerms.findOne({ _id: userId });
  const accepted = !!doc;

  termsCache.set(userId, accepted);
  return accepted;
}

export async function acceptBotTerms(userId: string): Promise<void> {
  await getCollections().acceptedTerms.updateOne(
    { _id: userId },
    { $set: { accepted_at: new Date() } },
    { upsert: true }
  );

  termsCache.set(userId, true);
}

export async function revokeBotTerms(userId: string): Promise<void> {
  await getCollections().acceptedTerms.deleteOne({ _id: userId });
  termsCache.set(userId, false);
}

export function clearBotTermsCache(): void {
  termsCache.clear();
}
