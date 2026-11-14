import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("mongoose", () => ({
  default: {
    connect: vi.fn(),
  },
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("connectDB", () => {
  it("checks MongoDB configuration when connecting, not when imported", async () => {
    vi.stubEnv("MONGODB_URI", "");

    const { connectDB } = await import("@/lib/mongodb");

    await expect(connectDB()).rejects.toThrow(
      "MONGODB_URI environment variable is required"
    );
  });
});
