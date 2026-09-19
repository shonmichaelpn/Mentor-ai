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

    const {
      code,
      scenario,
      instructions,
      expectedConcepts,
      evaluationCriteria,
      output,
      error,
      validation,
    } = body as Record<string, unknown>;

    const isBoundedString = (value: unknown, maximum: number) =>
      typeof value === "string" && value.length <= maximum;
    const areBoundedStrings = (value: unknown, maximum: number) =>
      Array.isArray(value) &&
      value.every((item) => isBoundedString(item, maximum));

    if (
      !isBoundedString(code, 20000) ||
      !isBoundedString(scenario, 5000) ||
      !areBoundedStrings(instructions, 2000) ||
      !areBoundedStrings(expectedConcepts, 1000) ||
      !areBoundedStrings(evaluationCriteria, 2000) ||
      !isBoundedString(output, 10000) ||
      (error !== null && error !== undefined && !isBoundedString(error, 4000)) ||
      !validation ||
      typeof validation !== "object"
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid evaluation request" },
        { status: 400 }
      );
    }

    const validationData = validation as {
      score?: unknown;
      checks?: unknown;
    };

    if (
      typeof validationData.score !== "number" ||
      !Array.isArray(validationData.checks) ||
      !validationData.checks.every(
        (check) =>
          check &&
          typeof check === "object" &&
          typeof (check as { requirement?: unknown }).requirement === "string" &&
          typeof (check as { passed?: unknown }).passed === "boolean"
      )
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid validation result" },
        { status: 400 }
      );
    }

    const instructionList = instructions as string[];
    const expectedConceptList = expectedConcepts as string[];
    const evaluationCriteriaList = evaluationCriteria as string[];

    const prompt = `
You are an expert programming mentor evaluating a student's coding challenge.

Challenge scenario:
${scenario}

Instructions:
${instructionList.join("\n")}

Expected concepts:
${expectedConceptList.join("\n")}

Evaluation criteria:
${evaluationCriteriaList.join("\n")}

Student code:
\`\`\`javascript
${code}
\`\`\`

Program output:
${output || "No output"}

Program error:
${error || "No error"}

Deterministic validation results:

${validationData.checks
  .map(
    (check: { requirement: string; passed: boolean }) =>
      `- ${check.passed ? "PASSED" : "FAILED"}: ${check.requirement}`
  )
  .join("\n")}

Deterministic validation score:
${validationData.score}/100

Use these deterministic validation results as evidence when evaluating
the student's solution.

Important:
- Do not claim that a requirement was satisfied if deterministic validation shows it failed.
- Consider both the deterministic validation and the actual program output.
- If the program has a runtime error, take that into account.
- The deterministic validation helps verify specific requirements, but you should still evaluate the overall solution intelligently.

Evaluate the student's solution based on the evaluation criteria.

Return ONLY a valid JSON object.

Do NOT:
- use Markdown
- use code fences
- add text before or after the JSON
- include comments inside the JSON
- include trailing commas

The JSON must have exactly this structure:

{
  "passed": true,
  "score": 85,
  "summary": "Short overall assessment",
  "strengths": [
    "What the student did correctly"
  ],
  "improvements": [
    "What the student should improve"
  ],
  "mentorFeedback": "A concise explanation written like a helpful programming mentor."
}

Rules:
- "passed" should be true only if the solution satisfies the important requirements.
- Score must be a number from 0 to 100.
- Do not require the code to match a specific implementation if another valid implementation satisfies the requirements.
- Focus on concepts, correctness, and the challenge requirements.
- Do not rewrite the student's code.
- Be constructive and beginner-friendly.
`;

    const startTime = Date.now();

    const response = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
    });

    console.log(
      `Gemini evaluation: ${Date.now() - startTime}ms`
    );

    const rawOutput = response.output_text ?? "";

    if (!rawOutput.trim()) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("Gemini raw response:", rawOutput);

    // Remove Markdown code fences if Gemini adds them anyway.
    let cleanedOutput = rawOutput
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Sometimes Gemini may add text around the JSON.
    // Try to extract the JSON object.
    const firstBrace = cleanedOutput.indexOf("{");
    const lastBrace = cleanedOutput.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanedOutput = cleanedOutput.slice(
        firstBrace,
        lastBrace + 1
      );
    }

    let evaluation;

    try {
      evaluation = JSON.parse(cleanedOutput);
    } catch {
      console.error("Failed to parse Gemini response:");
      console.error(cleanedOutput);

      throw new Error(
        "Gemini returned an invalid evaluation format."
      );
    }

    // Basic validation before sending the result to the frontend.
    if (
      typeof evaluation.passed !== "boolean" ||
      typeof evaluation.score !== "number" ||
      typeof evaluation.summary !== "string" ||
      !Array.isArray(evaluation.strengths) ||
      !Array.isArray(evaluation.improvements) ||
      typeof evaluation.mentorFeedback !== "string"
    ) {
      throw new Error(
        "Gemini returned an incomplete evaluation."
      );
    }

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error("Evaluation error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to evaluate the code.",
      },
      { status: 500 }
    );
  }
}