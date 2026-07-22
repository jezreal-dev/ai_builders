import "server-only";
import { and, asc, desc, eq, isNotNull, isNull, like, ne, or } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { getTodayInTimezone, getUpcomingRange } from "@/lib/utils/timezone";

const { tasks } = schema;

export async function getTasksByList(listId: string, userId: string) {
  return db
    .select()
    .from(tasks)
    .where(and(eq(tasks.listId, listId), eq(tasks.userId, userId), isNull(tasks.deletedAt)))
    .orderBy(asc(tasks.sortKey));
}

export async function getTodayTasks(userId: string, timezone: string) {
  const today = getTodayInTimezone(timezone);
  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.dueDate, today),
        isNull(tasks.deletedAt),
      ),
    )
    .orderBy(asc(tasks.sortKey));
}

export async function getUpcomingTasks(userId: string, timezone: string) {
  const { start, end } = getUpcomingRange(timezone);
  const rows = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        isNull(tasks.deletedAt),
        ne(tasks.status, "done"),
      ),
    )
    .orderBy(asc(tasks.dueDate), asc(tasks.sortKey));
  return rows.filter((t) => t.dueDate && t.dueDate >= start && t.dueDate <= end);
}

export async function getAllTasks(userId: string) {
  return db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), isNull(tasks.deletedAt)))
    .orderBy(asc(tasks.dueDate), asc(tasks.sortKey));
}

export async function getTrashedTasks(userId: string) {
  return db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), isNotNull(tasks.deletedAt)))
    .orderBy(desc(tasks.deletedAt));
}

export async function getTaskById(id: string, userId: string) {
  const rows = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createTask(data: {
  userId: string;
  listId: string;
  title: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  priority?: number;
  sortKey?: string;
}) {
  const id = uuidv4();
  const now = new Date();
  await db.insert(tasks).values({
    id,
    userId: data.userId,
    listId: data.listId,
    title: data.title,
    description: data.description ?? null,
    dueDate: data.dueDate ?? null,
    dueTime: data.dueTime ?? null,
    priority: data.priority ?? 4,
    sortKey: data.sortKey ?? "a0",
    status: "todo",
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function updateTask(
  id: string,
  userId: string,
  data: Partial<{
    title: string;
    description: string | null;
    dueDate: string | null;
    dueTime: string | null;
    priority: number;
    status: "todo" | "in_progress" | "done";
    listId: string;
    sortKey: string;
    completedAt: Date | null;
  }>,
) {
  await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

export async function softDeleteTask(id: string, userId: string) {
  await db
    .update(tasks)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

export async function restoreTask(id: string, userId: string) {
  await db
    .update(tasks)
    .set({ deletedAt: null, updatedAt: new Date() })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

export async function permanentDeleteTask(id: string, userId: string) {
  await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

export async function searchTasks(userId: string, query: string) {
  const q = `%${query}%`;
  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        isNull(tasks.deletedAt),
        or(like(tasks.title, q), like(tasks.description, q)),
      ),
    )
    .orderBy(asc(tasks.dueDate), asc(tasks.sortKey))
    .limit(20);
}
