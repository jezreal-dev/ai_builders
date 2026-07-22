"use client";
import { useState } from "react";
import { CheckCircle2, Inbox } from "lucide-react";
import { DragSortableList } from "./drag-sortable-list";
import { TaskDetailSheet } from "./task-detail-sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { Task } from "@/lib/db/schema";

interface TaskListProps {
  tasks: Task[];
  listId?: string;
  listName?: string;
  timezone?: string;
  showList?: boolean;
  listNames?: Record<string, string>;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TaskList({
  tasks,
  listId,
  listName,
  timezone = "UTC",
  showList = false,
  listNames,
  emptyTitle = "Nothing here",
  emptyDescription = "Add a task to get started",
}: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const activeTasks = tasks.filter((t) => t.status !== "done");
  const completedTasks = tasks.filter((t) => t.status === "done");

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-4 mb-4">
          <Inbox className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
        </div>
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{emptyTitle}</h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-[200px]">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-0.5">
        <DragSortableList
          tasks={activeTasks}
          listName={listName}
          timezone={timezone}
          showList={showList}
          listNames={listNames}
          onEdit={setSelectedTask}
        />

        {completedTasks.length > 0 && (
          <details className="mt-4" open={false}>
            <summary className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 dark:text-neutral-500 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300 select-none list-none">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {completedTasks.length} completed
            </summary>
            <div className="space-y-0.5 mt-1">
              {completedTasks.map((task) => (
                <DragSortableList
                  key={task.id}
                  tasks={[task]}
                  listName={listName}
                  timezone={timezone}
                  showList={showList}
                  listNames={listNames}
                  onEdit={setSelectedTask}
                />
              ))}
            </div>
          </details>
        )}
      </div>

      <TaskDetailSheet
        task={selectedTask}
        timezone={timezone}
        onClose={() => setSelectedTask(null)}
      />
    </>
  );
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <Skeleton className="h-[18px] w-[18px] rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
