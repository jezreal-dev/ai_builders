import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userProfiles = sqliteTable("user_profiles", {
  id: text("id").primaryKey(),
  displayName: text("display_name"),
  timezone: text("timezone").notNull().default("UTC"),
  theme: text("theme").notNull().default("system"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const lists = sqliteTable(
  "lists",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull().default("#6366F1"),
    sortKey: text("sort_key").notNull().default("a0"),
    archivedAt: integer("archived_at", { mode: "timestamp_ms" }),
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    version: integer("version").notNull().default(1),
  },
  (table) => [
    index("idx_lists_user").on(table.userId),
    index("idx_lists_user_sort").on(table.userId, table.sortKey),
  ],
);

export const tasks = sqliteTable(
  "tasks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    listId: text("list_id")
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status", { enum: ["todo", "in_progress", "done"] })
      .notNull()
      .default("todo"),
    priority: integer("priority").notNull().default(4),
    sortKey: text("sort_key").notNull().default("a0"),
    dueDate: text("due_date"),
    dueTime: text("due_time"),
    completedAt: integer("completed_at", { mode: "timestamp_ms" }),
    rrule: text("rrule"),
    recurrenceTz: text("recurrence_tz"),
    clientOpId: text("client_op_id"),
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    version: integer("version").notNull().default(1),
  },
  (table) => [
    index("idx_tasks_user_list").on(table.userId, table.listId, table.sortKey),
    index("idx_tasks_due").on(table.userId, table.dueDate),
    index("idx_tasks_updated").on(table.updatedAt),
  ],
);

export const listsRelations = relations(lists, ({ many, one }) => ({
  user: one(userProfiles, { fields: [lists.userId], references: [userProfiles.id] }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  list: one(lists, { fields: [tasks.listId], references: [lists.id] }),
  user: one(userProfiles, { fields: [tasks.userId], references: [userProfiles.id] }),
}));

export type UserProfile = typeof userProfiles.$inferSelect;
export type List = typeof lists.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type NewList = typeof lists.$inferInsert;
