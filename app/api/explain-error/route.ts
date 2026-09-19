import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getUserIdFromToken } from "@/lib/auth";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token || !getUserIdFromToken(token)) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { code, error, output } = body as Record<string, unknown>;

    if (
      typeof error !== "string" ||
      !error.trim() ||
      error.length > 4000 ||
      (code !== undefined &&
        (typeof code !== "string" || code.length > 20000)) ||
      (output !== undefined &&
        (typeof output !== "string" || output.length > 10000))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid error explanation request.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are a friendly programming mentor helping a beginner understand a JavaScript error.

Student code:
\`\`\`javascript
${code}
\`\`\`

Program output:
${output || "No output"}

Error:
${error}

Explain the error based specifically on the student's code and the actual error message.

Return ONLY a valid JSON object.

Do NOT:
- use Markdown
- use code fences
- add text before or after the JSON
- rewrite the student's entire code
- give an unrelated explanation
- assume an error that is not present
- include trailing commas

Return exactly this structure:

{
  "title": "Short description of the error",
  "whatHappened": "Explain what happened in simple beginner-friendly language.",
  "why": "Explain why JavaScript produced this error.",
  "hint": "Give the student a useful hint without solving the entire problem for them.",
  "concept": "The main JavaScript concept related to this error."
}

Keep the explanation concise, clear, and educational.
`;

    const startTime = Date.now();

    const response = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
    });

    console.log(
      `Gemini error explanation: ${Date.now() - startTime}ms`
    );

    const rawOutput = response.output_text ?? "";

    if (!rawOutput.trim()) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("Gemini explanation:", rawOutput);

    let cleanedOutput = rawOutput
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleanedOutput.indexOf("{");
    const lastBrace = cleanedOutput.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanedOutput = cleanedOutput.slice(
        firstBrace,
        lastBrace + 1
      );
    }

    let explanation;

    try {
      explanation = JSON.parse(cleanedOutput);
    } catch {
      console.error(
        "Failed to parse Gemini explanation:",
        cleanedOutput
      );

      throw new Error(
        "Gemini returned an invalid explanation format."
      );
    }

    if (
      typeof explanation.title !== "string" ||
      typeof explanation.whatHappened !== "string" ||
      typeof explanation.why !== "string" ||
      typeof explanation.hint !== "string" ||
      typeof explanation.concept !== "string"
    ) {
      throw new Error(
        "Gemini returned an incomplete explanation."
      );
    }

    return NextResponse.json({
      success: true,
      explanation,
    });
  } catch (error) {
    console.error("Explain error API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to explain the error.",
      },
      { status: 500 }
    );
  }
}