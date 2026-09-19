"use client";

import { useRouter } from "next/navigation";

const courses = [
  {
    id: "javascript",
    title: "JavaScript",
    description:
      "Build a strong JavaScript foundation through interactive lessons, tests, coding challenges, and AI-powered feedback.",
    chapters: 10,
    topics: "Variables · Functions · Arrays · DOM · Async · Debugging",
  },
  {
    id: "python",
    title: "Python",
    description:
      "Learn Python from the fundamentals through lists, dictionaries, comprehensions, OOP, file handling, and debugging.",
    chapters: 10,
    topics: "Variables · Functions · Lists · Dictionaries · OOP · Files",
  },
];

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="text-lg font-semibold tracking-tight">Mentor AI</div>

          <div className="flex items-center gap-5">
            <div className="hidden text-sm text-zinc-500 sm:block">
              Interactive Learning Platform
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900 hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-emerald-400">
            Learn by building
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Welcome to Mentor AI
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400">
            Learn programming through lessons, knowledge tests, coding
            challenges, and AI-powered feedback. Choose a learning path and
            start building your skills step by step.
          </p>
        </div>

        <div className="mt-16">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Choose your learning path</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Select a course to begin your learning journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course) => (
              <article
                key={course.id}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 transition hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Learning Path
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold">
                      {course.title}
                    </h3>
                  </div>

                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-center">
                    <div className="text-lg font-semibold">{course.chapters}</div>
                    <div className="text-[10px] uppercase tracking-wide text-zinc-500">
                      Chapters
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-zinc-400">
                  {course.description}
                </p>

                <p className="mt-5 text-xs leading-6 text-zinc-500">
                  {course.topics}
                </p>

                <button
                  onClick={() => router.push(`/learn/${course.id}`)}
                  className="mt-7 w-full rounded-lg bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
                >
                  Start Learning →
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
