"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { RotateCcw, Trash2, Inbox } from "lucide-react";
import { restoreTaskAction, permanentDeleteTaskAction } from "@/lib/actions/task.actions";
import { formatDueDate } from "@/lib/utils/timezone";
import type { Task } from "@/lib/db/schema";

interface TrashListProps {
  tasks: Task[];
  timezone?: string;
}

function TrashItem({ task, timezone = "UTC" }: { task: Task; timezone?: string }) {
  const [isPending, startTransition] = useTransition();

  function handleRestore() {
    startTransition(async () => {
      await restoreTaskAction(task.id);
      toast.success("Task restored");
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await permanentDeleteTaskAction(task.id);
      toast.success("Permanently deleted");
    });
  }

  const deletedDaysAgo = task.deletedAt
    ? Math.floor((Date.now() - new Date(task.deletedAt).getTime()) / 86400000)
    : 0;

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-neutral-100 dark:border-neutral-800 px-3 py-2.5 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-through truncate">{task.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            Deleted {deletedDaysAgo === 0 ? "today" : `${deletedDaysAgo}d ago`}
          </span>
          {task.dueDate && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              · Due {formatDueDate(task.dueDate, timezone)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleRestore}
          disabled={isPending}
          className="flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="h-3 w-3" />
          Restore
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-md border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors disabled:opacity-50"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
    </div>
  );
}

export function TrashList({ tasks, timezone }: TrashListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-4 mb-4">
          <Inbox className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
        </div>
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Trash is empty</h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-[200px]">
          Deleted tasks are kept for 30 days before being removed
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-3">
        {tasks.length} {tasks.length === 1 ? "item" : "items"} · Auto-deleted after 30 days
      </p>
      {tasks.map((task) => (
        <TrashItem key={task.id} task={task} timezone={timezone} />
      ))}
    </div>
  );
}
