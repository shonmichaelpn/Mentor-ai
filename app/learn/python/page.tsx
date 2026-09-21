"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import pythonChapters from "@/data/python/chapters.json";
import Sidebar from "@/components/Sidebar";
import LessonContent from "@/components/LessonContent";
import CodeEditor from "@/components/CodeEditor";
import Terminal from "@/components/Terminal";
import EvaluationPanel, { type Evaluation } from "@/components/EvaluationPanel";
import { Chapter } from "@/types/chapter";
import MCQTest from "@/components/MCQTest";
import { runPython } from "@/lib/codeRunner";
import { validateChallenge } from "@/lib/challengeValidator";

export default function Home() {
  const router = useRouter();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [codingPassed, setCodingPassed] = useState(false);

  const chapterData = pythonChapters as Chapter[];

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await fetch("/api/progress?courseId=python");

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          console.error("Failed to load progress");
          return;
        }

        const data = await response.json();
        setCompletedChapters(data.completedChapters || []);
      } catch (error) {
        console.error("Failed to load progress:", error);
      }
    };

    loadProgress();
  }, [router]);

  const [userCode, setUserCode] = useState(
    chapterData[0].codingChallenge.starterCode
  );
  const [terminalOutput, setTerminalOutput] = useState("");
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalExplanation, setTerminalExplanation] = useState<string | null>(null);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationChapterId, setEvaluationChapterId] = useState<number | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);
  const codingRef = useRef<HTMLDivElement>(null);
  const mentorRef = useRef<HTMLDivElement>(null);
  const evaluationRequestRef = useRef(0);

  const activeChapter = chapterData[currentChapter];

  const handleChapterChange = (index: number) => {
    evaluationRequestRef.current += 1;

    setCurrentChapter(index);
    setTestPassed(false);
    setCodingPassed(false);

    setUserCode(chapterData[index].codingChallenge.starterCode);
    setTerminalOutput("");
    setTerminalError(null);
    setTerminalExplanation(null);

    // Reset evaluation state when changing chapters
    setEvaluation(null);
    setEvaluationChapterId(null);
    setIsEvaluating(false);

    mainRef.current?.scrollTo(0, 0);
  };

  const handleSkipToTest = () => {
    testRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleContinueToCoding = () => {
  codingRef.current?.scrollIntoView({
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
      const result = await runPython(userCode);

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

    const requestId = evaluationRequestRef.current + 1;
    evaluationRequestRef.current = requestId;

    setIsEvaluating(true);
    setEvaluation(null);
    setEvaluationChapterId(activeChapter.id);

    try {
      const result = {
        output: [] as string[],
        error: null as string | null,
        timedOut: false,
      };

      const validation = validateChallenge(
        activeChapter,
        userCode,
        "python"
      );

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
          validation,
        }),
      });

      const data = await response.json();

      if (requestId !== evaluationRequestRef.current) {
        return;
      }

      if (response.status === 401) {
        router.push("/login");
        throw new Error("Your session has expired. Please sign in again.");
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Evaluation failed.");
      }

      setEvaluation(data.evaluation);

      mentorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (data.evaluation.passed) {
        setCodingPassed(true);

        setCompletedChapters((prev) =>
          prev.includes(activeChapter.id)
            ? prev
            : [...prev, activeChapter.id]
        );

        try {
          await fetch("/api/progress", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              courseId: "python",
              chapterId: activeChapter.id,
            }),
          });
        } catch (error) {
          console.error("Failed to save progress:", error);
        }

      }

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

  const isChapterCompleted = completedChapters.includes(activeChapter.id) || codingPassed;

  const handleRetakeChapter = () => {
    setTestPassed(false);
    setCodingPassed(false);
    setEvaluation(null);
    setEvaluationChapterId(null);
    setTerminalOutput("");
    setTerminalError(null);
    setTerminalExplanation(null);
    setUserCode(activeChapter.codingChallenge.starterCode);

    testRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleContinueToNextChapter = () => {
    if (currentChapter >= chapterData.length - 1) {
      return;
    }

    handleChapterChange(currentChapter + 1);

    mainRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleExplainError = async () => {
    if (!terminalError || isExplainingError) return;

    setIsExplainingError(true);
    setTerminalExplanation(null);

    try {
      const response = await fetch("/api/explain-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: userCode,
          error: terminalError,
          output: terminalOutput,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        throw new Error("Your session has expired. Please sign in again.");
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to explain the error."
        );
      }

      const explanation = data.explanation;

      setTerminalExplanation(
        `${explanation.title}

  What happened:
  ${explanation.whatHappened}

  Why:
  ${explanation.why}

  Hint:
  ${explanation.hint}

  Concept:
  ${explanation.concept}`
      );
    } catch (error) {
      console.error("Explain error:", error);

      setTerminalExplanation(
        error instanceof Error
          ? error.message
          : "Failed to explain the error."
      );
    } finally {
      setIsExplainingError(false);
    }
  };

  const progressPercent =
    chapterData.length > 0
      ? (completedChapters.length / chapterData.length) * 100
      : 0;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-zinc-950 text-white lg:flex-row">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close chapter menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      <Sidebar
        chapters={chapterData}
        currentChapter={currentChapter}
        completedChapters={completedChapters}
        onSelectChapter={(index) => {
          handleChapterChange(index);
          setSidebarOpen(false);
        }}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main 
        ref={mainRef}
        className="min-w-0 flex-1 overflow-y-auto"
      >
        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-200 transition hover:bg-zinc-800 lg:hidden"
                aria-label="Open chapters"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-zinc-500 lg:text-sm">
                  Learning Path
                </p>

                <p className="truncate text-base font-medium text-zinc-200 lg:text-base">
                  Python Fundamentals
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 lg:flex-row lg:items-center lg:gap-5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-accent">
                  {completedChapters.length} / {chapterData.length}
                </p>

                <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-zinc-800 sm:block sm:w-24">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <Link
                href="/courses"
                aria-label="Exit course and return to learning paths"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800 lg:h-auto lg:w-auto lg:px-3 lg:py-1.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6 3 12l6 6M3 12h13a5 5 0 0 0 0-10"
                  />
                </svg>
              </Link>
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
          className="border-t border-zinc-800 px-4 py-6 sm:px-8 sm:py-10"
        >
          <div className="mx-auto max-w-4xl">
            <MCQTest
              key={activeChapter.id}
              questions={activeChapter.mcqTest}
              onPassed={() => {
                setTestPassed(true);
                console.log("MCQ test passed");
              }}
              onContinue={handleContinueToCoding}
            />
          </div>
        </section>

        {/* Coding Environment */}
        <section
          ref={codingRef}
          className="border-t border-zinc-800 bg-zinc-950 px-4 py-6 sm:px-8 sm:py-10"
        >
          <div className="mx-auto max-w-6xl">
            {isChapterCompleted && (
              <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                ✅ Current chapter completed. You can continue to the next chapter or retake the quiz anytime.
              </div>
            )}

            {!testPassed && !isChapterCompleted && process.env.NODE_ENV !== "development" ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
                <div className="text-sm font-medium text-amber-400">
                  Coding Challenge Locked
                </div>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Pass the knowledge test to unlock this challenge
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                  Score at least 7 out of 10 on the knowledge test above.
                  Once you pass, the coding challenge and editor will become available.
                </p>
              </div>
            ) : isChapterCompleted ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-400">
                  ✓
                </div>

                <div className="mt-5 text-sm font-medium text-emerald-400">
                  Chapter Complete
                </div>

                <h2 className="mt-2 text-3xl font-semibold text-white">
                  {activeChapter.title}
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
                  This chapter is already complete. You can retake the quiz or restart the coding challenge any time.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    onClick={handleRetakeChapter}
                    className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/15"
                  >
                    Retake Quiz
                  </button>

                  <button
                    onClick={handleReset}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
                  >
                    Restart Challenge
                  </button>
                </div>

                {currentChapter < chapterData.length - 1 ? (
                  <button
                    onClick={handleContinueToNextChapter}
                    className="mt-8 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
                  >
                    Continue to Chapter {activeChapter.id + 1} →
                  </button>
                ) : (
                  <div className="mt-8 text-sm font-medium text-emerald-400">
                    🎉 You&apos;ve completed the learning path!
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Challenge Header */}
                <div className="mb-8">
                  <div className="mb-2 text-sm font-medium text-accent">
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
                <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
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
                        Python
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
                      language="python"
                    />
                  </div>

                  {/* Terminal */}
                  <Terminal 
                    output={terminalOutput}
                    error={terminalError}
                    explanation={terminalExplanation}
                    isRunning={isRunning}
                    isExplainingError={isExplainingError}
                    onExplainError={handleExplainError}
                    language="python"
                  />
                </div>
                
                {evaluationChapterId === activeChapter.id && (
                  <div ref={mentorRef} className="scroll-mt-20">
                    <EvaluationPanel
                      evaluation={evaluation}
                      isEvaluating={isEvaluating}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}