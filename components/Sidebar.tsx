"use client";

import { Chapter } from "@/types/chapter";

interface SidebarProps {
  chapters: Chapter[];
  currentChapter: number;
  completedChapters: number[];
  onSelectChapter: (index: number) => void;
}

export default function Sidebar({
  chapters,
  currentChapter,
  completedChapters,
  onSelectChapter,
}: SidebarProps) {
  return (
    <aside className="flex h-screen w-80 shrink-0 flex-col overflow-hidden border-r border-zinc-800 bg-zinc-950">
      {/* Logo */}
      <div className="border-b border-zinc-800 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
            M
          </div>

          <div>
            <h1 className="font-semibold text-white">
              Mentor AI
            </h1>

            <p className="text-xs text-zinc-500">
              JavaScript Path
            </p>
          </div>
        </div>
      </div>

      {/* Chapter list */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-4 flex items-center justify-between px-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Learning Path
          </span>

          <span className="text-xs text-zinc-600">
            {completedChapters.length}/{chapters.length}
          </span>
        </div>

        <div className="space-y-1">
          {chapters.map((chapter, index) => {
            const unlocked =
              index === 0 || completedChapters.includes(index - 1);

            const completed = completedChapters.includes(index);
            const active = currentChapter === index;

            return (
              <button
                key={chapter.id}
                disabled={!unlocked}
                onClick={() => onSelectChapter(index)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                  active
                    ? "bg-zinc-800 text-white"
                    : unlocked
                      ? "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      : "cursor-not-allowed text-zinc-700"
                }`}
              >
                {/* Chapter number */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                    completed
                      ? "bg-emerald-500/15 text-emerald-400"
                      : active
                        ? "bg-white text-black"
                        : unlocked
                          ? "bg-zinc-800 text-zinc-400"
                          : "bg-zinc-900 text-zinc-700"
                  }`}
                >
                  {completed ? "✓" : index + 1}
                </div>

                {/* Chapter title */}
                <span className="truncate text-sm">
                  {chapter.title}
                </span>

                {/* Lock */}
                {!unlocked && (
                  <span className="ml-auto text-xs text-zinc-700">
                    🔒
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}