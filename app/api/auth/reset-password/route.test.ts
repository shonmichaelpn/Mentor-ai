import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  connectDB: vi.fn(),
  findOneAndDelete: vi.fn(),
  hashPassword: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock("@/lib/mongodb", () => ({
  connectDB: mocks.connectDB,
}));

vi.mock("@/models/PasswordResetToken", () => ({
  default: { findOneAndDelete: mocks.findOneAndDelete },
}));

vi.mock("@/models/User", () => ({
  default: { updateOne: mocks.updateUser },
}));

vi.mock("bcryptjs", () => ({
  default: { hash: mocks.hashPassword },
}));

import { POST } from "@/app/api/auth/reset-password/route";

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid tokens and short passwords", async () => {
    const request = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "bad-token", password: "short" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(mocks.connectDB).not.toHaveBeenCalled();
  });

  it("rejects missing, expired, or already-used reset tokens", async () => {
    mocks.findOneAndDelete.mockResolvedValue(null);

    const request = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "a".repeat(64), password: "newpass123" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(mocks.findOneAndDelete).toHaveBeenCalledWith({
      tokenHash: expect.stringMatching(/^[\da-f]{64}$/),
      expiresAt: { $gt: expect.any(Date) },
    });
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("consumes a valid token and saves a hashed password", async () => {
    mocks.findOneAndDelete.mockResolvedValue({ email: "ada@example.com" });
    mocks.hashPassword.mockResolvedValue("hashed-password");
    mocks.updateUser.mockResolvedValue({ matchedCount: 1 });

    const request = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "b".repeat(64), password: "newpass123" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Password reset successfully" });
    expect(mocks.hashPassword).toHaveBeenCalledWith("newpass123", 10);
    expect(mocks.updateUser).toHaveBeenCalledWith(
      { email: "ada@example.com" },
      { $set: { password: "hashed-password" } }
    );
  });
});
