"use client";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface TaskCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  priority?: number;
}

const priorityColors: Record<number, string> = {
  1: "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500",
  2: "border-orange-400 data-[state=checked]:bg-orange-400 data-[state=checked]:border-orange-400",
  3: "border-blue-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400",
  4: "border-neutral-300 dark:border-neutral-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500",
};

export function TaskCheckbox({ checked, onCheckedChange, disabled, priority = 4 }: TaskCheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        priorityColors[priority] ?? priorityColors[4],
      )}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-3 w-3 text-white stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
