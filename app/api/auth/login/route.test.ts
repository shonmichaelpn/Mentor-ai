import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  connectDB: vi.fn(),
  findOne: vi.fn(),
  comparePassword: vi.fn(),
  signToken: vi.fn(),
}));

vi.mock("@/lib/mongodb", () => ({
  connectDB: mocks.connectDB,
}));

vi.mock("@/models/User", () => ({
  default: {
    findOne: mocks.findOne,
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: mocks.comparePassword,
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: mocks.signToken,
  },
}));

import { POST } from "@/app/api/auth/login/route";

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.findOne.mockResolvedValue(null);
  });

  it("rejects credentials for an unknown user", async () => {
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "unknown@example.com",
        password: "password123",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      message: "Invalid email or password",
    });
    expect(mocks.comparePassword).not.toHaveBeenCalled();
    expect(mocks.signToken).not.toHaveBeenCalled();
  });

  it("rejects an incorrect password for an existing user", async () => {
    mocks.findOne.mockResolvedValue({
      _id: "user-123",
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "hashed-password",
    });
    mocks.comparePassword.mockResolvedValue(false);

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "ada@example.com",
        password: "wrong-password",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      message: "Invalid email or password",
    });
    expect(mocks.comparePassword).toHaveBeenCalledWith(
      "wrong-password",
      "hashed-password"
    );
    expect(mocks.signToken).not.toHaveBeenCalled();
  });

  it("logs in a valid user and sets an HTTP-only token cookie", async () => {
    mocks.findOne.mockResolvedValue({
      _id: "user-123",
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "hashed-password",
    });
    mocks.comparePassword.mockResolvedValue(true);
    mocks.signToken.mockReturnValue("signed-token");

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "ADA@EXAMPLE.COM",
        password: "correct-password",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "Login successful",
      user: {
        id: "user-123",
        name: "Ada Lovelace",
        email: "ada@example.com",
      },
    });
    expect(mocks.comparePassword).toHaveBeenCalledWith(
      "correct-password",
      "hashed-password"
    );
    expect(mocks.signToken).toHaveBeenCalled();
    expect(setCookie).toContain("token=signed-token");
    expect(setCookie).toContain("HttpOnly");
  });
});
