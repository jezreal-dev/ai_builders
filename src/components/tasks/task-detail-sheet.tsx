"use client";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Calendar, Flag, AlignLeft } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateTaskAction, deleteTaskAction } from "@/lib/actions/task.actions";
import type { Task } from "@/lib/db/schema";

interface TaskDetailSheetProps {
  task: Task | null;
  timezone?: string;
  onClose: () => void;
}

const PRIORITY_OPTIONS = [
  { value: 1, label: "P1 — Urgent", color: "bg-red-500" },
  { value: 2, label: "P2 — High", color: "bg-orange-400" },
  { value: 3, label: "P3 — Medium", color: "bg-blue-400" },
  { value: 4, label: "P4 — Low", color: "bg-neutral-300 dark:bg-neutral-600" },
];

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
] as const;

export function TaskDetailSheet({ task, timezone = "UTC", onClose }: TaskDetailSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [priority, setPriority] = useState(task?.priority ?? 4);
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">(
    (task?.status as "todo" | "in_progress" | "done") ?? "todo",
  );

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setDueDate(task.dueDate ?? "");
      setPriority(task.priority);
      setStatus(task.status as "todo" | "in_progress" | "done");
    }
  }, [task?.id]);

  function handleSave() {
    if (!task || !title.trim()) return;
    startTransition(async () => {
      await updateTaskAction({
        id: task.id,
        title: title.trim(),
        description: description || null,
        dueDate: dueDate || null,
        priority,
        status,
      });
      toast.success("Task updated");
      onClose();
    });
  }

  function handleDelete() {
    if (!task) return;
    startTransition(async () => {
      await deleteTaskAction(task.id);
      toast.success("Moved to trash");
      onClose();
    });
  }

  return (
    <Sheet open={!!task} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-2">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="w-full text-sm font-medium bg-transparent border-b border-neutral-200 dark:border-neutral-700 pb-1.5 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
              <AlignLeft className="h-3.5 w-3.5" />
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes…"
              rows={4}
            />
          </div>

          {/* Due date + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-9 px-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                <Flag className="h-3.5 w-3.5" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full h-9 px-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">Status</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`flex-1 py-1.5 text-xs rounded-md border transition-colors ${
                    status === s.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                      : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metadata */}
          {task && (
            <div className="text-xs text-neutral-400 dark:text-neutral-500 space-y-0.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <p>Created {new Date(task.createdAt!).toLocaleDateString()}</p>
              {task.completedAt && <p>Completed {new Date(task.completedAt).toLocaleDateString()}</p>}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isPending || !title.trim()}>
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
