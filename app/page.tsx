"use client";

import { useRef, useState } from "react";

import chapters from "@/data/chapters.json";
import CodeEditor from "@/components/CodeEditor";
import LessonContent from "@/components/LessonContent";
import Sidebar from "@/components/Sidebar";
import Terminal from "@/components/Terminal";
import { Chapter } from "@/types/chapter";

const chapterData = chapters as Chapter[];

export default function Home() {
  const [currentChapter, setCurrentChapter] = useState(0);

  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

  const [userCode, setUserCode] = useState(chapterData[0].starterCode);

  const [terminalOutput, setTerminalOutput] = useState("");

  const testRef = useRef<HTMLDivElement>(null);

  const activeChapter = chapterData[currentChapter];

  const handleChapterChange = (index: number) => {
    setCurrentChapter(index);

    setUserCode(chapterData[index].starterCode);

    setTerminalOutput("");
  };

  const handleSkipToTest = () => {
    testRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="flex h-screen overflow-hidden bg-zinc-950 text-white">
      {/* Sidebar */}
      <Sidebar
        chapters={chapterData}
        currentChapter={currentChapter}
        completedChapters={completedChapters}
        onSelectChapter={handleChapterChange}
      />

      {/* Main area */}
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Top navigation */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 px-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-600">
              JavaScript Fundamentals
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-zinc-500">Progress</p>

              <p className="text-sm font-medium text-white">
                {completedChapters.length} / {chapterData.length}
              </p>
            </div>

            <div className="h-2 w-32 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${
                    (completedChapters.length / chapterData.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-12">
            {/* Lesson */}
            <LessonContent
              chapter={activeChapter}
              onSkipToTest={handleSkipToTest}
            />

            {/* Coding environment */}
            <div ref={testRef} className="mx-auto mt-16 max-w-4xl pb-12">
              {/* Editor heading */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Coding Environment
                  </p>

                  <h3 className="mt-1 text-xl font-semibold">
                    Complete the challenge
                  </h3>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUserCode(activeChapter.starterCode);

                      setTerminalOutput("");
                    }}
                    className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                  >
                    Reset
                  </button>

                  <button
                    onClick={() =>
                      setTerminalOutput(
                        "Code execution will be connected on Day 2.",
                      )
                    }
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                  >
                    Run Code
                  </button>

                  <button
                    onClick={() =>
                      setTerminalOutput(
                        "AI evaluation will be connected on Day 3.",
                      )
                    }
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Editor + Terminal */}
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                <div className="h-[420px]">
                  <CodeEditor value={userCode} onChange={setUserCode} />
                </div>

                <Terminal output={terminalOutput} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
