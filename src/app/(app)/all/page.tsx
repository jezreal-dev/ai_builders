import { requireSession } from "@/lib/auth/session";
import { getAllTasks } from "@/lib/repositories/task.repository";
import { getUserLists } from "@/lib/repositories/list.repository";
import { TaskList } from "@/components/tasks/task-list";
import { AddTaskForm } from "@/components/tasks/add-task-form";
import { AppHeader } from "@/components/layout/app-header";

export default async function AllPage() {
  const session = await requireSession();
  const user = session.user as typeof session.user & { timezone?: string };
  const timezone = user.timezone ?? "UTC";

  const [tasks, lists] = await Promise.all([
    getAllTasks(user.id),
    getUserLists(user.id),
  ]);

  const defaultList = lists.find((l) => l.name === "My Tasks") ?? lists[0];
  const listNames = Object.fromEntries(lists.map((l) => [l.id, l.name]));

  return (
    <div className="flex flex-col min-h-full">
      <AppHeader
        title="All Tasks"
        subtitle={`${tasks.filter((t) => t.status !== "done").length} remaining`}
        userName={user.name ?? undefined}
        userEmail={user.email}
        timezone={timezone}
      />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 space-y-4">
        <TaskList
          tasks={tasks}
          timezone={timezone}
          listNames={listNames}
          showList
          emptyTitle="No tasks yet"
          emptyDescription="Create your first task below"
        />
        {defaultList && (
          <AddTaskForm listId={defaultList.id} placeholder="Add a task…" />
        )}
      </div>
    </div>
  );
}
