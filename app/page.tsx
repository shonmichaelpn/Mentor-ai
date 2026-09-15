"use client";

import { useRef, useState } from "react";
import chapters from "@/data/chapters.json";
import Sidebar from "@/components/Sidebar";
import LessonContent from "@/components/LessonContent";
import CodeEditor from "@/components/CodeEditor";
import Terminal from "@/components/Terminal";
import EvaluationPanel from "@/components/EvaluationPanel";
import { Chapter } from "@/types/chapter";
import { runJavaScript } from "@/lib/codeRunner";
import MCQTest from "@/components/MCQTest";
 

const chapterData = chapters as Chapter[];

export default function Home() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [userCode, setUserCode] = useState(
    chapterData[0].codingChallenge.starterCode
  );
  const [terminalOutput, setTerminalOutput] = useState("");
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalExplanation, setTerminalExplanation] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const testRef = useRef<HTMLDivElement>(null);

  const activeChapter = chapterData[currentChapter];

  const handleChapterChange = (index: number) => {
    setCurrentChapter(index);
    setUserCode(chapterData[index].codingChallenge.starterCode);
    setTerminalOutput("");
    setTerminalError(null);
    setTerminalExplanation(null);
  };

  const handleSkipToTest = () => {
    testRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setTerminalOutput("");
    setTerminalError(null);
    setTerminalExplanation(null);

    try {
      const result = await runJavaScript(userCode);

      if (result.timedOut) {
        setTerminalError("Execution timed out.");
        return;
      }

      if (result.error) {
        setTerminalOutput(result.output.join("\n"));
        setTerminalError(result.error);
        return;
      }

      if (result.output.length === 0) {
        setTerminalOutput("Program finished with no output.");
        return;
      }

      setTerminalOutput(result.output.join("\n"));
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setUserCode(activeChapter.codingChallenge.starterCode);
    setTerminalOutput("");
    setTerminalError(null);
    setTerminalExplanation(null);
  };

  const handleSubmit = async () => {
    if (isEvaluating) return;

    setIsEvaluating(true);
    setEvaluation(null);

    try {
      const result = await runJavaScript(userCode);

      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: userCode,
          scenario: activeChapter.codingChallenge.scenario,
          instructions: activeChapter.codingChallenge.instructions,
          expectedConcepts: activeChapter.codingChallenge.expectedConcepts,
          evaluationCriteria:
            activeChapter.codingChallenge.evaluationCriteria,
          output: result.output.join("\n"),
          error: result.error,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Evaluation failed.");
      }

      setEvaluation(data.evaluation);
    } catch (error) {
      console.error("Submit error:", error);

      setTerminalError(
        error instanceof Error
          ? error.message
          : "Failed to evaluate the challenge."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleExplainError = () => {
    setTerminalExplanation(
      "`cons` is not a valid JavaScript keyword.\n\n" +
        "It looks like you meant `const`.\n\n" +
        "`const` is used when a variable should not be reassigned.\n\n" +
        'Example:\nconst uname = "shon";'
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-white">
      {/* Sidebar */}
      <Sidebar
        chapters={chapterData}
        currentChapter={currentChapter}
        completedChapters={completedChapters}
        onSelectChapter={handleChapterChange}
      />

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <p className="text-sm text-zinc-500">
                Learning Path
              </p>

              <p className="text-sm font-medium text-zinc-200">
                JavaScript Fundamentals
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-zinc-500">
                Progress
              </p>

              <p className="text-sm font-semibold text-zinc-200">
                {completedChapters.length} / {chapterData.length}
              </p>
            </div>
          </div>
        </header>

        {/* Lesson */}
        <LessonContent
          chapter={activeChapter}
          onSkipToTest={handleSkipToTest}
        />

        {/* Test */}
        <section
          ref={testRef}
          className="border-t border-zinc-800 px-8 py-10"
        >
          <div className="mx-auto max-w-4xl">
            <MCQTest
              key={activeChapter.id}
              questions={activeChapter.mcqTest}
              onPassed={() => {
                console.log("MCQ test passed");
              }}
            />
          </div>
        </section>

        {/* Coding Environment */}
        <section className="border-t border-zinc-800 bg-zinc-950 px-8 py-10">
          <div className="mx-auto max-w-6xl">

            {/* Challenge Header */}
            <div className="mb-8">
              <div className="mb-2 text-sm font-medium text-emerald-400">
                Coding Challenge
              </div>

              <h2 className="text-3xl font-semibold text-white">
                {activeChapter.codingChallenge.title}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                {activeChapter.codingChallenge.scenario}
              </p>
            </div>

            {/* Challenge Instructions */}
            <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-sm font-semibold text-zinc-200">
                Your Task
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Complete the challenge below using what you learned in this chapter.
                Make sure your code satisfies all of the following requirements.
              </p>

              <ul className="mt-5 space-y-3">
                {activeChapter.codingChallenge.instructions.map(
                  (instruction, index) => (
                    <li
                      key={instruction}
                      className="flex gap-3 text-sm leading-6 text-zinc-300"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-400">
                        {index + 1}
                      </span>

                      <span>{instruction}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Editor + Terminal */}

            <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3">
                  <span className="text-sm font-medium text-zinc-300">
                    JavaScript
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-800"
                    >
                      Reset
                    </button>

                    <button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isRunning ? "Running..." : "Run Code"}
                    </button>

                    <button
                      onClick={handleSubmit}
                      disabled={isEvaluating}
                      className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-400"
                    >
                      {isEvaluating ? "Evaluating..." : "Submit"}
                    </button>
                  </div>
                </div>

                <CodeEditor
                  value={userCode}
                  onChange={setUserCode}
                />
              </div>

              {/* Terminal */}
              <Terminal 
                output={terminalOutput}
                error={terminalError}
                explanation={terminalExplanation}
                isRunning={isRunning}
                onExplainError={handleExplainError}
              />
            </div>
            <EvaluationPanel
              evaluation={evaluation}
              isEvaluating={isEvaluating}
            />
          </div>
        </section>
      </main>
    </div>
  );
}