"use client";
import { useState, useRef, useTransition } from "react";
import { Plus, Calendar, Flag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { createTaskAction } from "@/lib/actions/task.actions";

const PRIORITY_OPTIONS = [
  { value: 1, label: "P1", color: "text-red-500" },
  { value: 2, label: "P2", color: "text-orange-400" },
  { value: 3, label: "P3", color: "text-blue-400" },
  { value: 4, label: "P4", color: "text-neutral-400" },
];

interface AddTaskFormProps {
  listId: string;
  placeholder?: string;
  onAdded?: () => void;
}

export function AddTaskForm({ listId, placeholder = "Add a task… (press N)", onAdded }: AddTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(4);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function openForm() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      reset();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function reset() {
    setOpen(false);
    setTitle("");
    setDueDate("");
    setPriority(4);
  }

  function handleSubmit() {
    if (!title.trim()) return;
    startTransition(async () => {
      const result = await createTaskAction({
        listId,
        title: title.trim(),
        dueDate: dueDate || undefined,
        priority,
      });
      if ("error" in result && result.error) {
        toast.error("Failed to create task");
        return;
      }
      toast.success("Task added");
      reset();
      onAdded?.();
    });
  }

  if (!open) {
    return (
      <button
        onClick={openForm}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 rounded-lg transition-colors group"
      >
        <Plus className="h-4 w-4 text-indigo-500 group-hover:scale-110 transition-transform" />
        {placeholder}
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-neutral-900 shadow-sm p-3 space-y-2">
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task name"
        className="w-full text-sm bg-transparent outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
      />

      <div className="flex items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 flex-1">
          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-7 pl-7 pr-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="h-7 pl-2 pr-6 text-xs border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <Flag className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={reset}
            disabled={isPending}
            className="h-7 px-3 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || isPending}
            className="h-7 px-3 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add task
          </button>
        </div>
      </div>
    </div>
  );
}
