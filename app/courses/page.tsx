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
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="font-display text-lg font-medium tracking-tight">
            Mentor AI
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden text-sm text-muted sm:block">
              Interactive Learning Platform
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-foreground"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Learn by building
          </div>

          <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
            Welcome to Mentor AI
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
            Learn programming through lessons, knowledge tests, coding
            challenges, and AI-powered feedback. Choose a learning path and
            start building your skills step by step.
          </p>
        </div>

        <div className="mt-16">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-medium">
              Choose your learning path
            </h2>
            <p className="mt-2 text-sm text-muted">
              Select a course to begin your learning journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course) => (
              <article
                key={course.id}
                className="group rounded-2xl border border-border bg-surface p-7 transition hover:border-accent/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-muted">
                      Learning path
                    </p>

                    <h3 className="mt-2 font-display text-2xl font-medium">
                      {course.title}
                    </h3>
                  </div>

                  <div className="rounded-lg border border-border bg-background px-3 py-2 text-center">
                    <div className="font-display text-lg font-medium">
                      {course.chapters}
                    </div>
                    <div className="font-mono text-[10px] text-muted">
                      chapters
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-muted">
                  {course.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {course.topics.split(" · ").map((topic) => (
                    <span
                      key={topic}
                      className="rounded border border-border bg-background px-2 py-1 font-mono text-[11px] text-muted"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => router.push(`/learn/${course.id}`)}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
                >
                  Start Learning
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}