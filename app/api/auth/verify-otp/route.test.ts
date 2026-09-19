import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  connectDB: vi.fn(),
  findOne: vi.fn(),
  deleteOne: vi.fn(),
  compareCode: vi.fn(),
  createUser: vi.fn(),
}));

vi.mock("@/lib/mongodb", () => ({
  connectDB: mocks.connectDB,
}));

vi.mock("@/models/EmailVerification", () => ({
  default: {
    findOne: mocks.findOne,
    deleteOne: mocks.deleteOne,
  },
}));

vi.mock("@/models/User", () => ({
  default: {
    findOne: mocks.findOne,
    create: mocks.createUser,
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: mocks.compareCode,
  },
}));

import { POST } from "@/app/api/auth/verify-otp/route";

describe("POST /api/auth/verify-otp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects a code that is not six digits", async () => {
    const request = new Request("http://localhost/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        email: "ada@example.com",
        code: "1234",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "A valid email and six-digit code are required",
    });
    expect(mocks.connectDB).not.toHaveBeenCalled();
    expect(mocks.compareCode).not.toHaveBeenCalled();
  });

  it("rejects a valid-format code when the verification has expired", async () => {
    mocks.findOne.mockResolvedValue(null);

    const request = new Request("http://localhost/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        email: "ada@example.com",
        code: "123456",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "Invalid or expired verification code",
    });
    expect(mocks.findOne).toHaveBeenCalled();
    expect(mocks.compareCode).not.toHaveBeenCalled();
    expect(mocks.createUser).not.toHaveBeenCalled();
  });
});
