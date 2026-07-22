import "server-only";
import { and, asc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sortKeyBetween } from "@/lib/utils/sort-key";

const { lists } = schema;

export async function getUserLists(userId: string) {
  return db
    .select()
    .from(lists)
    .where(and(eq(lists.userId, userId), isNull(lists.deletedAt)))
    .orderBy(asc(lists.sortKey));
}

export async function getListById(id: string, userId: string) {
  const rows = await db
    .select()
    .from(lists)
    .where(and(eq(lists.id, id), eq(lists.userId, userId), isNull(lists.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createList(data: {
  userId: string;
  name: string;
  color?: string;
  sortKey?: string;
}) {
  const id = uuidv4();
  const now = Date.now();
  await db.insert(lists).values({
    id,
    userId: data.userId,
    name: data.name,
    color: data.color ?? "#6366F1",
    sortKey: data.sortKey ?? "a0",
    createdAt: new Date(now),
    updatedAt: new Date(now),
  });
  return id;
}

export async function updateList(
  id: string,
  userId: string,
  data: { name?: string; color?: string },
) {
  await db
    .update(lists)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(lists.id, id), eq(lists.userId, userId)));
}

export async function deleteList(id: string, userId: string) {
  await db
    .update(lists)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(lists.id, id), eq(lists.userId, userId)));
}

export async function reorderLists(
  userId: string,
  id: string,
  beforeSortKey: string | null,
  afterSortKey: string | null,
) {
  const newKey = sortKeyBetween(beforeSortKey, afterSortKey);
  await db
    .update(lists)
    .set({ sortKey: newKey, updatedAt: new Date() })
    .where(and(eq(lists.id, id), eq(lists.userId, userId)));
}
