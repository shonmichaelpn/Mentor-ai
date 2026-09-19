import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCookie: vi.fn(),
  getUserIdFromToken: vi.fn(),
  createEvaluation: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: mocks.getCookie,
  }),
}));

vi.mock("@/lib/auth", () => ({
  getUserIdFromToken: mocks.getUserIdFromToken,
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    interactions = {
      create: mocks.createEvaluation,
    };
  },
}));

import { POST } from "@/app/api/evaluate/route";

describe("POST /api/evaluate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCookie.mockReturnValue(undefined);
    mocks.getUserIdFromToken.mockReturnValue(null);
  });

  it("rejects unauthenticated requests before calling Gemini", async () => {
    const request = new Request("http://localhost/api/evaluate", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      success: false,
      error: "Not authenticated",
    });
    expect(mocks.createEvaluation).not.toHaveBeenCalled();
  });

  it("rejects malformed authenticated requests before calling Gemini", async () => {
    mocks.getCookie.mockReturnValue({ value: "valid-token" });
    mocks.getUserIdFromToken.mockReturnValue("user-123");

    const request = new Request("http://localhost/api/evaluate", {
      method: "POST",
      body: JSON.stringify({ code: "console.log('hello')" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      success: false,
      error: "Invalid evaluation request",
    });
    expect(mocks.createEvaluation).not.toHaveBeenCalled();
  });
});
