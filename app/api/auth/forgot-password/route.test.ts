import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  connectDB: vi.fn(),
  findUser: vi.fn(),
  findOneAndUpdate: vi.fn(),
  deleteOne: vi.fn(),
  sendPasswordResetLink: vi.fn(),
}));

vi.mock("@/lib/mongodb", () => ({
  connectDB: mocks.connectDB,
}));

vi.mock("@/lib/mailer", () => ({
  sendPasswordResetLink: mocks.sendPasswordResetLink,
}));

vi.mock("@/models/User", () => ({
  default: { findOne: mocks.findUser },
}));

vi.mock("@/models/PasswordResetToken", () => ({
  default: {
    findOneAndUpdate: mocks.findOneAndUpdate,
    deleteOne: mocks.deleteOne,
  },
}));

import { POST } from "@/app/api/auth/forgot-password/route";

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("APP_URL", "https://mentor.example");
    mocks.findUser.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects an invalid email address", async () => {
    const request = new Request("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "not-an-email" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(mocks.connectDB).not.toHaveBeenCalled();
  });

  it("returns the same success response when no account exists", async () => {
    const request = new Request("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "unknown@example.com" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "If an account exists for this email, a password reset link has been sent.",
    });
    expect(mocks.sendPasswordResetLink).not.toHaveBeenCalled();
  });

  it("stores a hashed expiring token and emails a reset link for an account", async () => {
    mocks.findUser.mockResolvedValue({ email: "ada@example.com" });

    const request = new Request("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "ADA@EXAMPLE.COM" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mocks.findOneAndUpdate).toHaveBeenCalledWith(
      { email: "ada@example.com" },
      expect.objectContaining({
        email: "ada@example.com",
        tokenHash: expect.stringMatching(/^[\da-f]{64}$/),
        expiresAt: expect.any(Date),
      }),
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    expect(mocks.sendPasswordResetLink).toHaveBeenCalledWith(
      "ada@example.com",
      expect.stringMatching(/^https:\/\/mentor\.example\/reset-password\?token=[\da-f]{64}$/)
    );
  });
});
