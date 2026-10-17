import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import PasswordResetToken from "@/models/PasswordResetToken";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (
      typeof token !== "string" ||
      !/^[\da-f]{64}$/i.test(token) ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return NextResponse.json(
        { message: "A valid reset link and a password of at least 6 characters are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const reset = await PasswordResetToken.findOneAndDelete({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!reset) {
      return NextResponse.json(
        { message: "This password reset link is invalid or has expired" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.updateOne(
      { email: reset.email },
      { $set: { password: hashedPassword } }
    );

    if (result.matchedCount !== 1) {
      return NextResponse.json(
        { message: "This password reset link is invalid or has expired" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
