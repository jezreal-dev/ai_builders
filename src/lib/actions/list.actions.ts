"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import * as listRepo from "@/lib/repositories/list.repository";

const createListSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

const updateListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export async function createListAction(formData: FormData) {
  const session = await requireSession();
  const parsed = createListSchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color") ?? undefined,
  });
  if (!parsed.success) return { error: "Invalid input" };

  const id = await listRepo.createList({
    userId: session.user.id,
    name: parsed.data.name,
    color: parsed.data.color,
  });
  revalidatePath("/", "layout");
  return { success: true, id };
}

export async function updateListAction(formData: FormData) {
  const session = await requireSession();
  const parsed = updateListSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name") ?? undefined,
    color: formData.get("color") ?? undefined,
  });
  if (!parsed.success) return { error: "Invalid input" };

  await listRepo.updateList(parsed.data.id, session.user.id, {
    name: parsed.data.name,
    color: parsed.data.color,
  });
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteListAction(id: string) {
  const session = await requireSession();
  await listRepo.deleteList(id, session.user.id);
  revalidatePath("/", "layout");
  return { success: true };
}
