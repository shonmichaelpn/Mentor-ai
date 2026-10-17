import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";

import { connectDB } from "@/lib/mongodb";
import { sendPasswordResetLink } from "@/lib/mailer";
import PasswordResetToken from "@/models/PasswordResetToken";
import User from "@/models/User";

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

function getAppUrl() {
  const configuredUrl =
    process.env.APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const appUrl =
    configuredUrl || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

  if (!appUrl) {
    throw new Error("APP_URL must be configured to send password reset links");
  }

  return appUrl;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "A valid email address is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      const token = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(token).digest("hex");

      await PasswordResetToken.findOneAndUpdate(
        { email: normalizedEmail },
        {
          email: normalizedEmail,
          tokenHash,
          expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const resetUrl = new URL("/reset-password", getAppUrl());
      resetUrl.searchParams.set("token", token);

      try {
        await sendPasswordResetLink(normalizedEmail, resetUrl.toString());
      } catch (error) {
        await PasswordResetToken.deleteOne({ email: normalizedEmail, tokenHash });
        throw error;
      }
    }

    return NextResponse.json(
      {
        message:
          "If an account exists for this email, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
