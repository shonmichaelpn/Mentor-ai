import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { proxy } from "./proxy";

describe("authentication proxy", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(["/forgot-password", "/reset-password"])(
    "allows unauthenticated requests to %s",
    (path) => {
      vi.stubEnv("JWT_SECRET", "");

      const response = proxy(new NextRequest(`http://localhost${path}`));

      expect(response.headers.get("x-middleware-next")).toBe("1");
      expect(response.headers.get("location")).toBeNull();
    }
  );

  it("continues to redirect protected pages to login", () => {
    vi.stubEnv("JWT_SECRET", "");

    const response = proxy(new NextRequest("http://localhost/courses"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/login");
  });
});
