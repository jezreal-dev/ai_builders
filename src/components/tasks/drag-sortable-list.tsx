"use client";
import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "./task-card";
import { reorderTaskAction } from "@/lib/actions/task.actions";
import type { Task } from "@/lib/db/schema";

interface SortableItemProps {
  task: Task;
  listName?: string;
  timezone?: string;
  showList?: boolean;
  onEdit?: (task: Task) => void;
}

function SortableItem({ task, listName, timezone, showList, onEdit }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        listName={listName}
        timezone={timezone}
        showList={showList}
        onEdit={onEdit}
        dragHandleProps={{ ...attributes, ...listeners } as React.HTMLAttributes<HTMLButtonElement>}
      />
    </div>
  );
}

interface DragSortableListProps {
  tasks: Task[];
  listName?: string;
  timezone?: string;
  showList?: boolean;
  listNames?: Record<string, string>;
  onEdit?: (task: Task) => void;
}

export function DragSortableList({ tasks: initialTasks, listName, timezone, showList, listNames, onEdit }: DragSortableListProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(tasks, oldIndex, newIndex);

    setTasks(reordered);

    const beforeKey = newIndex > 0 ? reordered[newIndex - 1].sortKey : null;
    const afterKey = newIndex < reordered.length - 1 ? reordered[newIndex + 1].sortKey : null;

    startTransition(() => {
      reorderTaskAction(reordered[newIndex].id, beforeKey, afterKey);
    });
  }

  // Sync with server updates
  if (initialTasks.length !== tasks.length || initialTasks.some((t, i) => tasks[i]?.id !== t.id)) {
    setTasks(initialTasks);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <SortableItem
            key={task.id}
            task={task}
            listName={listNames?.[task.listId] ?? listName}
            timezone={timezone}
            showList={showList}
            onEdit={onEdit}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
