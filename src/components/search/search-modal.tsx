"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Loader2, CheckCircle2, Circle, CalendarDays } from "lucide-react";
import { searchTasksAction } from "@/lib/actions/task.actions";
import { formatDueDate } from "@/lib/utils/timezone";
import type { Task } from "@/lib/db/schema";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timezone?: string;
}

export function SearchModal({ open, onOpenChange, timezone = "UTC" }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Task[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName))) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await searchTasksAction(query);
        setResults(res.tasks);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(task: Task) {
    onOpenChange(false);
    setQuery("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-2xl overflow-hidden">
        <Command shouldFilter={false}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
            {isPending ? (
              <Loader2 className="h-4 w-4 text-neutral-400 animate-spin shrink-0" />
            ) : (
              <Search className="h-4 w-4 text-neutral-400 shrink-0" />
            )}
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search tasks…"
              autoFocus
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
            <kbd className="text-xs text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded px-1.5 py-0.5">Esc</kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            {!query.trim() && (
              <Command.Empty className="py-8 text-center text-sm text-neutral-400">
                Start typing to search tasks…
              </Command.Empty>
            )}
            {query.trim() && !isPending && results.length === 0 && (
              <Command.Empty className="py-8 text-center text-sm text-neutral-400">
                No tasks found for "{query}"
              </Command.Empty>
            )}
            {results.map((task) => (
              <Command.Item
                key={task.id}
                value={task.id}
                onSelect={() => handleSelect(task)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 data-[selected=true]:bg-neutral-100 dark:data-[selected=true]:bg-neutral-800 transition-colors"
              >
                {task.status === "done" ? (
                  <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-neutral-300 dark:text-neutral-600 shrink-0" />
                )}
                <span className={`flex-1 truncate ${task.status === "done" ? "line-through text-neutral-400" : ""}`}>
                  {task.title}
                </span>
                {task.dueDate && (
                  <span className="flex items-center gap-1 text-xs text-neutral-400 shrink-0">
                    <CalendarDays className="h-3 w-3" />
                    {formatDueDate(task.dueDate, timezone)}
                  </span>
                )}
              </Command.Item>
            ))}
          </Command.List>

          <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-3 text-xs text-neutral-400">
            <span><kbd className="border border-neutral-200 dark:border-neutral-700 rounded px-1">↑↓</kbd> navigate</span>
            <span><kbd className="border border-neutral-200 dark:border-neutral-700 rounded px-1">↵</kbd> select</span>
            <span><kbd className="border border-neutral-200 dark:border-neutral-700 rounded px-1">esc</kbd> close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
