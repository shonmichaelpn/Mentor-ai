import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import EmailVerification from "@/models/EmailVerification";
import User from "@/models/User";

export async function POST(request: Request) {
	try {
		const { email, code } = await request.json();
		const normalizedEmail =
			typeof email === "string" ? email.trim().toLowerCase() : "";
		const normalizedCode = typeof code === "string" ? code.trim() : "";

		if (!normalizedEmail || !/^\d{6}$/.test(normalizedCode)) {
			return NextResponse.json(
				{ message: "A valid email and six-digit code are required" },
				{ status: 400 }
			);
		}

		await connectDB();

		const verification = await EmailVerification.findOne({
			email: normalizedEmail,
			expiresAt: { $gt: new Date() },
		});

		if (!verification || !(await bcrypt.compare(normalizedCode, verification.codeHash))) {
			return NextResponse.json(
				{ message: "Invalid or expired verification code" },
				{ status: 400 }
			);
		}

		const existingUser = await User.findOne({ email: normalizedEmail });
		if (existingUser) {
			await EmailVerification.deleteOne({ _id: verification._id });
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 409 }
			);
		}

		const user = await User.create({
			name: verification.name,
			email: verification.email,
			password: verification.password,
			courses: [
				{ courseId: "javascript", completedChapters: [] },
				{ courseId: "python", completedChapters: [] },
			],
		});

		await EmailVerification.deleteOne({ _id: verification._id });

		return NextResponse.json(
			{
				message: "User registered successfully",
				user: { id: user._id, name: user.name, email: user.email },
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("OTP verification error:", error);

		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 }
		);
	}
}
