import { describe, expect, it } from "vitest";

import { validateChallenge } from "@/lib/challengeValidator";
import type { Chapter } from "@/types/chapter";

const variablesChapter = { id: 1 } as Chapter;

describe("validateChallenge", () => {
  it("passes a JavaScript solution that demonstrates the required variables concepts", () => {
    const code = `
      const name = "Ada";
      let score = 10;
      const attempts = 2;
      let active = true;
      score = 20;
      console.log(name, score);
      console.log(typeof name);
    `;

    const result = validateChallenge(variablesChapter, code, "javascript");

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("fails a solution that does not demonstrate the required concepts", () => {
    const code = `
      var name = "Ada";
      console.log(name);
    `;

    const result = validateChallenge(variablesChapter, code, "javascript");

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(70);
  });

  it("passes a Python solution that demonstrates the required variables concepts", () => {
    const code = `
      name = "Ada"
      score = 10
      attempts = 2
      active = True
      score = 20
      print(name, score)
      print(type(name))
    `;

    const result = validateChallenge(variablesChapter, code, "python");

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });
});
