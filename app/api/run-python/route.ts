import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = typeof body?.code === "string" ? body.code : "";
    const timeoutMs = Number(body?.timeout ?? 3000);

    if (!code.trim()) {
      return NextResponse.json({
        output: [],
        error: "Empty Python code.",
        timedOut: false,
      });
    }

    return await new Promise<NextResponse>((resolve) => {
      const child = spawn("python", ["-c", code], {
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";
      let settled = false;

      const finish = (result: {
        output: string[];
        error: string | null;
        timedOut: boolean;
      }) => {
        if (settled) return;
        settled = true;
        resolve(NextResponse.json(result));
      };

      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        finish({
          output: [],
          error: "Execution timed out.",
          timedOut: true,
        });
      }, Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 3000);

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      child.on("close", (code) => {
        clearTimeout(timer);

        if (code === 0) {
          finish({
            output: stdout ? stdout.trimEnd().split(/\r?\n/) : ["Program finished with no output."],
            error: null,
            timedOut: false,
          });
          return;
        }

        finish({
          output: stdout ? stdout.trimEnd().split(/\r?\n/) : [],
          error: stderr || `Python exited with code ${code}.`,
          timedOut: false,
        });
      });

      child.on("error", (error) => {
        clearTimeout(timer);
        finish({
          output: [],
          error: error instanceof Error ? error.message : String(error),
          timedOut: false,
        });
      });
    });
  } catch (error) {
    return NextResponse.json(
      {
        output: [],
        error:
          error instanceof Error ? error.message : "Python execution failed.",
        timedOut: false,
      },
      { status: 400 }
    );
  }
}
