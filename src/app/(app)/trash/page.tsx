import { requireSession } from "@/lib/auth/session";
import { getTrashedTasks } from "@/lib/repositories/task.repository";
import { AppHeader } from "@/components/layout/app-header";
import { TrashList } from "@/components/tasks/trash-list";

export default async function TrashPage() {
  const session = await requireSession();
  const user = session.user as typeof session.user & { timezone?: string };
  const timezone = user.timezone ?? "UTC";

  const tasks = await getTrashedTasks(user.id);

  return (
    <div className="flex flex-col min-h-full">
      <AppHeader
        title="Trash"
        subtitle="Items deleted within 30 days"
        userName={user.name ?? undefined}
        userEmail={user.email}
        timezone={timezone}
      />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6">
        <TrashList tasks={tasks} timezone={timezone} />
      </div>
    </div>
  );
}
