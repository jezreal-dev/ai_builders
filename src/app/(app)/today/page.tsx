import { requireSession } from "@/lib/auth/session";
import { getTodayTasks } from "@/lib/repositories/task.repository";
import { getUserLists } from "@/lib/repositories/list.repository";
import { TaskList } from "@/components/tasks/task-list";
import { AddTaskForm } from "@/components/tasks/add-task-form";
import { AppHeader } from "@/components/layout/app-header";
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";

export default async function TodayPage() {
  const session = await requireSession();
  const user = session.user as typeof session.user & { timezone?: string };
  const timezone = user.timezone ?? "UTC";

  const [tasks, lists] = await Promise.all([
    getTodayTasks(user.id, timezone),
    getUserLists(user.id),
  ]);

  const defaultList = lists.find((l) => l.name === "My Tasks") ?? lists[0];
  const todayDate = format(new TZDate(Date.now(), timezone), "EEEE, MMMM d");

  return (
    <div className="flex flex-col min-h-full">
      <AppHeader
        title="Today"
        subtitle={todayDate}
        userName={user.name ?? undefined}
        userEmail={user.email}
        timezone={timezone}
      />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 space-y-4">
        <TaskList
          tasks={tasks}
          timezone={timezone}
          listNames={Object.fromEntries(lists.map((l) => [l.id, l.name]))}
          showList={false}
          emptyTitle="A clear day ahead"
          emptyDescription="Add tasks due today to get started"
        />
        {defaultList && (
          <AddTaskForm
            listId={defaultList.id}
            placeholder="Add a task for today… (press N)"
          />
        )}
      </div>
    </div>
  );
}
