import { describe, it, expect } from "vitest";
import { formatDate } from "@/lib/utils/formatDate";

describe("formatDate", () => {
  it("formats a valid ISO string to a readable US date", () => {
    const result = formatDate("2024-03-15T10:30:00Z");
    expect(result).toBe("March 15, 2024");
  });

  it("formats a date-only ISO string without crashing", () => {
    // Date-only strings are parsed as UTC midnight and displayed in local time.
    // We verify it returns a valid date string with month name and year.
    const result = formatDate("2023-06-15");
    expect(result).toMatch(/June \d{1,2}, 2023/);
  });

  it("handles end-of-year date", () => {
    const result = formatDate("2024-12-31T23:59:59Z");
    expect(result).toBe("December 31, 2024");
  });

  it("returns 'Invalid Date' for an empty string", () => {
    const result = formatDate("");
    expect(result).toBe("Invalid Date");
  });
});
