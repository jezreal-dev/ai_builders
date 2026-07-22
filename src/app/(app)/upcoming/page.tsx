import { requireSession } from "@/lib/auth/session";
import { getUpcomingTasks } from "@/lib/repositories/task.repository";
import { getUserLists } from "@/lib/repositories/list.repository";
import { TaskList } from "@/components/tasks/task-list";
import { AppHeader } from "@/components/layout/app-header";

export default async function UpcomingPage() {
  const session = await requireSession();
  const user = session.user as typeof session.user & { timezone?: string };
  const timezone = user.timezone ?? "UTC";

  const [tasks, lists] = await Promise.all([
    getUpcomingTasks(user.id, timezone),
    getUserLists(user.id),
  ]);

  return (
    <div className="flex flex-col min-h-full">
      <AppHeader
        title="Upcoming"
        subtitle="Next 7 days"
        userName={user.name ?? undefined}
        userEmail={user.email}
        timezone={timezone}
      />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6">
        <TaskList
          tasks={tasks}
          timezone={timezone}
          listNames={Object.fromEntries(lists.map((l) => [l.id, l.name]))}
          showList
          emptyTitle="Nothing coming up"
          emptyDescription="Tasks due in the next 7 days will appear here"
        />
      </div>
    </div>
  );
}
