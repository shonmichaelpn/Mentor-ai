import { describe, expect, it } from "vitest";

import { getLatestUnlockedChapterIndex } from "@/lib/courseProgress";

describe("getLatestUnlockedChapterIndex", () => {
  it("starts at chapter 0 when no progress is saved", () => {
    const chapters = [{ id: 0 }, { id: 1 }, { id: 2 }];

    expect(getLatestUnlockedChapterIndex(chapters, [])).toBe(0);
  });

  it("opens the next unlocked chapter after completing the previous one", () => {
    const chapters = [{ id: 0 }, { id: 1 }, { id: 2 }];

    expect(getLatestUnlockedChapterIndex(chapters, [0])).toBe(1);
  });

  it("returns the latest unlocked chapter in the path", () => {
    const chapters = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

    expect(getLatestUnlockedChapterIndex(chapters, [0, 1, 2])).toBe(3);
  });
});
