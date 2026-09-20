import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = new Set(["/", "/login", "/register", "/register/otp"]);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (publicRoutes.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token || !process.env.JWT_SECRET) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js)$).*)"],
};