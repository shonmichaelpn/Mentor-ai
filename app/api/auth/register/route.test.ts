import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  connectDB: vi.fn(),
  sendVerificationCode: vi.fn(),
  findOne: vi.fn(),
  findOneAndUpdate: vi.fn(),
  hashPassword: vi.fn(),
}));

vi.mock("@/lib/mongodb", () => ({
  connectDB: mocks.connectDB,
}));

vi.mock("@/lib/mailer", () => ({
  sendVerificationCode: mocks.sendVerificationCode,
}));

vi.mock("@/models/User", () => ({
  default: {
    findOne: mocks.findOne,
  },
}));

vi.mock("@/models/EmailVerification", () => ({
  default: {
    findOneAndUpdate: mocks.findOneAndUpdate,
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: mocks.hashPassword,
  },
}));

import { POST } from "@/app/api/auth/register/route";

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects registration when required fields are missing", async () => {
    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "ada@example.com",
        password: "password123",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "Name, email and password are required",
    });
    expect(mocks.connectDB).not.toHaveBeenCalled();
    expect(mocks.sendVerificationCode).not.toHaveBeenCalled();
  });

  it("creates a verification record and sends an OTP for valid registration", async () => {
    mocks.findOne.mockResolvedValue(null);
    mocks.hashPassword
      .mockResolvedValueOnce("hashed-password")
      .mockResolvedValueOnce("hashed-code");
    mocks.findOneAndUpdate.mockResolvedValue({ _id: "verification-123" });

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Ada Lovelace",
        email: "ADA@EXAMPLE.COM",
        password: "password123",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({
      message: "Verification code sent",
      email: "ada@example.com",
    });
    expect(mocks.findOneAndUpdate).toHaveBeenCalled();
    expect(mocks.sendVerificationCode).toHaveBeenCalledWith(
      "ada@example.com",
      expect.stringMatching(/^\d{6}$/)
    );
  });
});
