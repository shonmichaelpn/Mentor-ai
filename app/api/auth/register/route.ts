import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";

import { connectDB } from "@/lib/mongodb";
import { sendVerificationCode } from "@/lib/mailer";
import EmailVerification from "@/models/EmailVerification";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedName || !normalizedEmail || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const code = randomInt(100000, 1000000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const codeHash = await bcrypt.hash(code, 10);
    const verification = await EmailVerification.findOneAndUpdate(
      { email: normalizedEmail },
      {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        codeHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    try {
      await sendVerificationCode(normalizedEmail, code);
    } catch (error) {
      await EmailVerification.deleteOne({ _id: verification._id });
      throw error;
    }

    return NextResponse.json(
      {
        message: "Verification code sent",
        email: normalizedEmail,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof Error && error.message.includes("SMTP_")) {
      return NextResponse.json(
        { message: "Email verification is not configured on the server" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}