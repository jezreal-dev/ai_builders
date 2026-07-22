"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { and, eq, isNull } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createList } from "@/lib/repositories/list.repository";

const { userProfiles, tasks, lists } = schema;

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  timezone: z.string().min(1).max(100).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
});

export async function ensureUserProfile(userId: string) {
  const existing = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, userId))
    .limit(1);

  if (existing.length > 0) return existing[0];

  // Create profile
  const now = new Date();
  await db.insert(userProfiles).values({
    id: userId,
    createdAt: now,
    updatedAt: now,
  });

  // Create default "My Tasks" list
  await createList({ userId, name: "My Tasks", color: "#6366F1", sortKey: "a0" });

  const newProfile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, userId))
    .limit(1);
  return newProfile[0];
}

export async function updateUserProfile(formData: FormData) {
  const session = await requireSession();
  const raw = {
    displayName: formData.get("displayName") as string | undefined,
    timezone: formData.get("timezone") as string | undefined,
    theme: formData.get("theme") as string | undefined,
  };
  const parsed = updateProfileSchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid input" };

  await db
    .update(userProfiles)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(userProfiles.id, session.user.id));

  revalidatePath("/", "layout");
  return { success: true };
}

export async function getUserProfile(userId: string) {
  const rows = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, userId))
    .limit(1);
  return rows[0] ?? null;
}
