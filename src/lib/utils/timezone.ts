import { TZDate } from "@date-fns/tz";
import { addDays, format, startOfDay } from "date-fns";

export function getTodayInTimezone(timezone: string): string {
  const now = new TZDate(Date.now(), timezone);
  return format(now, "yyyy-MM-dd");
}

export function getUpcomingRange(timezone: string): { start: string; end: string } {
  const today = new TZDate(Date.now(), timezone);
  const tomorrow = addDays(today, 1);
  const end = addDays(today, 7);
  return {
    start: format(tomorrow, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  };
}

export function isOverdue(dueDate: string | null, timezone: string): boolean {
  if (!dueDate) return false;
  const today = getTodayInTimezone(timezone);
  return dueDate < today;
}

export function formatDueDate(dueDate: string | null, timezone: string): string {
  if (!dueDate) return "";
  const today = getTodayInTimezone(timezone);
  const tomorrow = format(addDays(new TZDate(Date.now(), timezone), 1), "yyyy-MM-dd");
  if (dueDate === today) return "Today";
  if (dueDate === tomorrow) return "Tomorrow";
  return format(new TZDate(`${dueDate}T12:00:00`, timezone), "MMM d");
}

export const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];
