import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  initialSortKey,
  sortKeyBetween,
} from "@/lib/utils/sort-key";
import {
  COMMON_TIMEZONES,
  formatDueDate,
  getTodayInTimezone,
  getUpcomingRange,
  isOverdue,
} from "@/lib/utils/timezone";

const freezeNow = (iso: string) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(iso));
};

describe("TaskFlow core utility suite", () => {
  beforeEach(() => {
    freezeNow("2026-07-23T12:00:00Z");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("sort-key ordering helpers", () => {
    it("returns the canonical initial sort key when no neighbors exist", () => {
      expect(initialSortKey()).toBe("a0");
    });

    it("creates a stable middle sort key when inserting between two neighbors", () => {
      const between = sortKeyBetween("a0", "a2");
      expect(between).toBe("a1");
    });

    it("falls back to an extended key when a gap cannot be created", () => {
      expect(sortKeyBetween("a0", "a0")).toBe("a0m");
    });

    it("creates a low-end sort key when only the after value exists", () => {
      expect(sortKeyBetween(null, "a1")).toBe("a0");
    });

    it("creates a high-end sort key when only the before value exists", () => {
      expect(sortKeyBetween("a1", null)).toBe("a1m");
    });
  });

  describe("timezone utilities", () => {
    it("returns the current date in UTC for the provided timezone context", () => {
      expect(getTodayInTimezone("UTC")).toBe("2026-07-23");
    });

    it("returns the upcoming date range as tomorrow through the next 7 days", () => {
      expect(getUpcomingRange("UTC")).toEqual({
        start: "2026-07-24",
        end: "2026-07-30",
      });
    });

    it("detects overdue items when a due date is earlier than today", () => {
      expect(isOverdue("2026-07-22", "UTC")).toBe(true);
      expect(isOverdue("2026-07-23", "UTC")).toBe(false);
      expect(isOverdue(null, "UTC")).toBe(false);
    });

    it("formats the due date into polished human labels", () => {
      expect(formatDueDate("2026-07-23", "UTC")).toBe("Today");
      expect(formatDueDate("2026-07-24", "UTC")).toBe("Tomorrow");
      expect(formatDueDate("2026-07-30", "UTC")).toBe("Jul 30");
      expect(formatDueDate(null, "UTC")).toBe("");
    });

    it("includes the expected primary timezone list for cross-region production support", () => {
      expect(COMMON_TIMEZONES).toContain("UTC");
      expect(COMMON_TIMEZONES).toContain("America/New_York");
      expect(COMMON_TIMEZONES).toContain("Europe/London");
      expect(COMMON_TIMEZONES).toContain("Asia/Tokyo");
      expect(COMMON_TIMEZONES).toContain("Australia/Sydney");
    });
  });
});
