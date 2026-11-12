import { getCollections } from "../database/db.js";

const permissionCache = new Map<string, number>();

export async function getUserBotPermissionLevel(
  userId: string
): Promise<number> {
  if (permissionCache.has(userId)) {
    return permissionCache.get(userId)!;
  }

  const doc = await getCollections().userPermissions.findOne({ _id: userId });

  if (!doc) {
    permissionCache.set(userId, 0);
    return 0;
  }

  const level = Number(doc.permission_level) || 0;
  permissionCache.set(userId, level);
  return level;
}

export async function setUserBotPermissionLevel(
  userId: string,
  level: number
): Promise<void> {
  await getCollections().userPermissions.updateOne(
    { _id: userId },
    { $set: { permission_level: level } },
    { upsert: true }
  );

  permissionCache.set(userId, level);
}

export async function removeUserBotPermissionLevel(
  userId: string
): Promise<void> {
  await getCollections().userPermissions.deleteOne({ _id: userId });
  permissionCache.delete(userId);
}

export function clearBotPermissionCache(): void {
  permissionCache.clear();
}
