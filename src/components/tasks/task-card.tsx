"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Calendar, GripVertical, Pencil } from "lucide-react";
import { TaskCheckbox } from "./task-checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { formatDueDate, isOverdue } from "@/lib/utils/timezone";
import { toggleTaskCompleteAction, deleteTaskAction } from "@/lib/actions/task.actions";
import type { Task } from "@/lib/db/schema";

const priorityLabels: Record<number, string> = { 1: "P1", 2: "P2", 3: "P3", 4: "P4" };
const priorityDotColors: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-orange-400",
  3: "bg-blue-400",
  4: "bg-neutral-300 dark:bg-neutral-600",
};

interface TaskCardProps {
  task: Task;
  listName?: string;
  timezone?: string;
  showList?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  onEdit?: (task: Task) => void;
}

export function TaskCard({ task, listName, timezone = "UTC", showList = false, dragHandleProps, onEdit }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticDone, setOptimisticDone] = useState(task.status === "done");

  const isDone = optimisticDone;
  const overdue = !isDone && isOverdue(task.dueDate, timezone);

  function handleComplete(checked: boolean) {
    setOptimisticDone(checked);
    startTransition(async () => {
      const result = await toggleTaskCompleteAction(task.id);
      if ("error" in result) {
        setOptimisticDone(!checked);
        toast.error("Failed to update task");
        return;
      }
      if (result.wasCompleted) {
        toast.success("Task completed", {
          action: {
            label: "Undo",
            onClick: () => {
              startTransition(async () => {
                setOptimisticDone(false);
                await toggleTaskCompleteAction(task.id);
              });
            },
          },
        });
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTaskAction(task.id);
      toast.success("Moved to trash", {
        description: "Restored within 30 days",
      });
    });
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border border-transparent px-3 py-2.5 hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-all",
        isDone && "opacity-50",
        isPending && "pointer-events-none",
      )}
    >
      {dragHandleProps && (
        <button
          {...dragHandleProps}
          className="mt-0.5 cursor-grab touch-none text-neutral-300 dark:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}

      <TaskCheckbox
        checked={isDone}
        onCheckedChange={handleComplete}
        priority={task.priority}
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm leading-snug break-words",
            isDone && "line-through text-neutral-400 dark:text-neutral-500",
          )}
        >
          {task.title}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          {task.dueDate && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs",
                overdue
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-neutral-400 dark:text-neutral-500",
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDueDate(task.dueDate, timezone)}
            </span>
          )}
          {showList && listName && (
            <Badge variant="outline" className="text-xs py-0 px-1.5 h-4">
              {listName}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <span
          className={cn("h-2 w-2 rounded-full shrink-0", priorityDotColors[task.priority])}
          title={priorityLabels[task.priority]}
        />
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            aria-label="Edit task"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-1 rounded text-neutral-400 hover:text-red-500 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
