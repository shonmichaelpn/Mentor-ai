import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { message: "courseId is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = getUserIdFromToken(token);

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid session" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const course = user.courses.find(
      (item) => item.courseId === courseId
    );

    return NextResponse.json({
      courseId,
      completedChapters: course?.completedChapters ?? [],
    });
  } catch (error) {
    console.error("Get progress error:", error);

    return NextResponse.json(
      { message: "Failed to load progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { courseId, chapterId } = await request.json();

    if (!courseId || !chapterId) {
      return NextResponse.json(
        { message: "courseId and chapterId are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = getUserIdFromToken(token);

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid session" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const course = user.courses.find(
      (item) => item.courseId === courseId
    );

    if (!course) {
      user.courses.push({
        courseId,
        completedChapters: [chapterId],
      });
    } else if (!course.completedChapters.includes(chapterId)) {
      course.completedChapters.push(chapterId);
    }

    await user.save();

    return NextResponse.json({
      message: "Progress saved",
      courseId,
      completedChapters:
        user.courses.find((item) => item.courseId === courseId)
          ?.completedChapters ?? [],
    });
  } catch (error) {
    console.error("Progress error:", error);

    return NextResponse.json(
      { message: "Failed to save progress" },
      { status: 500 }
    );
  }
}