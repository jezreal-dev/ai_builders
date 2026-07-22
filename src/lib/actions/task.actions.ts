"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import * as taskRepo from "@/lib/repositories/task.repository";
import { sortKeyBetween } from "@/lib/utils/sort-key";

const createTaskSchema = z.object({
  listId: z.string().uuid(),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  priority: z.coerce.number().int().min(1).max(4).optional(),
});

const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).nullable().optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  priority: z.coerce.number().int().min(1).max(4).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  listId: z.string().uuid().optional(),
});

export async function createTaskAction(data: z.infer<typeof createTaskSchema>) {
  const session = await requireSession();
  const parsed = createTaskSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid input", details: parsed.error.flatten() };

  const id = await taskRepo.createTask({
    userId: session.user.id,
    ...parsed.data,
  });
  revalidatePath("/", "layout");
  return { success: true, id };
}

export async function updateTaskAction(data: z.infer<typeof updateTaskSchema>) {
  const session = await requireSession();
  const parsed = updateTaskSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid input" };

  const { id, ...rest } = parsed.data;
  await taskRepo.updateTask(id, session.user.id, rest);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function toggleTaskCompleteAction(id: string) {
  const session = await requireSession();
  const task = await taskRepo.getTaskById(id, session.user.id);
  if (!task) return { error: "Task not found" };

  const isDone = task.status === "done";
  await taskRepo.updateTask(id, session.user.id, {
    status: isDone ? "todo" : "done",
    completedAt: isDone ? null : new Date(),
  });
  revalidatePath("/", "layout");
  return { success: true, wasCompleted: !isDone };
}

export async function deleteTaskAction(id: string) {
  const session = await requireSession();
  await taskRepo.softDeleteTask(id, session.user.id);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function restoreTaskAction(id: string) {
  const session = await requireSession();
  await taskRepo.restoreTask(id, session.user.id);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function permanentDeleteTaskAction(id: string) {
  const session = await requireSession();
  await taskRepo.permanentDeleteTask(id, session.user.id);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function reorderTaskAction(
  id: string,
  beforeSortKey: string | null,
  afterSortKey: string | null,
) {
  const session = await requireSession();
  const newKey = sortKeyBetween(beforeSortKey, afterSortKey);
  await taskRepo.updateTask(id, session.user.id, { sortKey: newKey });
  revalidatePath("/", "layout");
  return { success: true };
}

export async function searchTasksAction(query: string) {
  const session = await requireSession();
  if (!query.trim()) return { tasks: [] };
  const results = await taskRepo.searchTasks(session.user.id, query.trim());
  return { tasks: results };
}
