import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getTasksByList } from "@/lib/repositories/task.repository";
import { getListById, getUserLists } from "@/lib/repositories/list.repository";
import { TaskList } from "@/components/tasks/task-list";
import { AddTaskForm } from "@/components/tasks/add-task-form";
import { AppHeader } from "@/components/layout/app-header";

interface ListPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListPage({ params }: ListPageProps) {
  const { id } = await params;
  const session = await requireSession();
  const user = session.user as typeof session.user & { timezone?: string };
  const timezone = user.timezone ?? "UTC";

  const [list, tasks] = await Promise.all([
    getListById(id, user.id),
    getTasksByList(id, user.id),
  ]);

  if (!list) notFound();

  return (
    <div className="flex flex-col min-h-full">
      <AppHeader
        title={list.name}
        subtitle={`${tasks.filter((t) => t.status !== "done").length} remaining`}
        userName={user.name ?? undefined}
        userEmail={user.email}
        timezone={timezone}
      />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: list.color }}
          />
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{list.name}</span>
        </div>
        <TaskList
          tasks={tasks}
          listId={list.id}
          listName={list.name}
          timezone={timezone}
          emptyTitle="List is empty"
          emptyDescription="Add your first task to this list"
        />
        <AddTaskForm listId={list.id} placeholder={`Add to ${list.name}…`} />
      </div>
    </div>
  );
}
