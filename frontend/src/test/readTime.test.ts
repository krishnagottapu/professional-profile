import { describe, it, expect } from "vitest";
import { estimateReadTime } from "@/lib/utils/readTime";

describe("estimateReadTime", () => {
  it("returns '1 min read' for short content", () => {
    expect(estimateReadTime("Hello world")).toBe("1 min read");
  });

  it("returns minimum 1 min read for empty content", () => {
    expect(estimateReadTime("")).toBe("1 min read");
  });

  it("calculates correct read time for longer content", () => {
    // 400 words should be 2 min at 200 words/min
    const words = Array(400).fill("word").join(" ");
    expect(estimateReadTime(words)).toBe("2 min read");
  });

  it("rounds up to next minute", () => {
    // 201 words = 1.005 min → ceil = 2 min
    const words = Array(201).fill("word").join(" ");
    expect(estimateReadTime(words)).toBe("2 min read");
  });

  it("strips HTML tags before counting words", () => {
    const html = "<p>Hello</p> <strong>world</strong> <a href='#'>link</a>";
    // 3 words → 1 min
    expect(estimateReadTime(html)).toBe("1 min read");
  });

  it("strips complex HTML and counts only text words", () => {
    // 200 words wrapped in tags → 1 min
    const words = Array(200)
      .fill("<span>word</span>")
      .join(" ");
    expect(estimateReadTime(words)).toBe("1 min read");
  });
});
