import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const {
      code,
      scenario,
      instructions,
      expectedConcepts,
      evaluationCriteria,
      output,
      error,
    } = await request.json();

    const prompt = `
You are an expert programming mentor evaluating a student's coding challenge.

Challenge scenario:
${scenario}

Instructions:
${instructions.join("\n")}

Expected concepts:
${expectedConcepts.join("\n")}

Evaluation criteria:
${evaluationCriteria.join("\n")}

Student code:
\`\`\`javascript
${code}
\`\`\`

Program output:
${output || "No output"}

Program error:
${error || "No error"}

Evaluate the student's solution based on the evaluation criteria.

Return your response in this exact JSON format:

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
- Score from 0 to 100.
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

    console.log(`Gemini evaluation: ${Date.now() - startTime}ms`);

    const rawOutput = response.output_text ?? "{}";

    const cleanedOutput = rawOutput
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

    const evaluation = JSON.parse(cleanedOutput);

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error("Evaluation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to evaluate the code.",
      },
      { status: 500 }
    );
  }
}