"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <header className="fixed inset-x-0 top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
          <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
            <div className="flex items-baseline font-display text-lg font-medium">
              Mentor
              <span className="ml-2 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">
                AI
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-muted transition hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="grid flex-1 items-center gap-16 pb-24 pt-40 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-5xl font-medium leading-[1.1] sm:text-6xl">
              Code with someone looking over your shoulder.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-muted">
              Learn programming through interactive lessons, knowledge tests, coding challenges, and AI-powered feedback that 
              helps you understand where you went wrong.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-md bg-accent px-7 py-3.5 text-center text-sm font-medium text-accent-foreground transition hover:opacity-90"
              >
                Create an account
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-border px-7 py-3.5 text-center text-sm font-medium text-foreground transition hover:bg-surface"
              >
                I already have an account
              </Link>
            </div>
          </div>

          {/* Editor mock */}
          <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="ml-2 font-mono text-xs text-muted">
                sum.py
              </span>
            </div>

            <div className="px-5 py-5 font-mono text-[13px] leading-7">
              <div className="flex gap-4">
                <span className="w-4 select-none text-right text-muted/50">
                  1
                </span>
                <span>
                  <span className="text-accent">def</span> total(items):
                </span>
              </div>
              <div className="flex gap-4">
                <span className="w-4 select-none text-right text-muted/50">
                  2
                </span>
                <span className="pl-4">result = 0</span>
              </div>
              <div className="flex gap-4">
                <span className="w-4 select-none text-right text-muted/50">
                  3
                </span>
                <span className="pl-4">
                  <span className="text-accent">for</span> i{" "}
                  <span className="text-accent">in</span>{" "}
                  <span className="text-code-ok">range</span>(len(items)):
                </span>
              </div>
              <div className="flex gap-4 rounded bg-code-err/10">
                <span className="w-4 select-none text-right text-muted/50">
                  4
                </span>
                <span className="pl-8">result += items[i + i]</span>
              </div>
              <div className="flex gap-4">
                <span className="w-4 select-none text-right text-muted/50">
                  5
                </span>
                <span className="pl-4">
                  <span className="text-accent">return</span> result
                </span>
              </div>

              <div className="mt-4 rounded-r border-l-2 border-accent bg-surface-2 p-3 text-sm leading-6 text-muted">
                <span className="font-medium text-accent">Mentor</span> —
                line 4 adds{" "}
                <code className="text-foreground">i</code> to itself instead
                of stepping forward. Try{" "}
                <code className="text-foreground">items[i]</code>. This kind
                of off-by-one mistake is the most common bug in loops.
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border py-24">
          <h2 className="font-display text-3xl font-medium">
            How a lesson unfolds
          </h2>
          <p className="mt-3 max-w-md text-muted">
            Every topic moves through the same three steps, so you always
            know what's next.
          </p>

          <div className="mt-14 divide-y divide-border">
            <div className="flex gap-8 py-8">
              <span className="w-10 font-display text-2xl text-muted/40">
                1
              </span>
              <div>
                <h3 className="font-display text-xl font-medium">Read</h3>
                <p className="mt-2 max-w-md text-muted">
                  Short explanations built around real code, not textbook
                  theory. Every concept ends with something you can run.
                </p>
              </div>
            </div>

            <div className="flex gap-8 py-8">
              <span className="w-10 font-display text-2xl text-muted/40">
                2
              </span>
              <div>
                <h3 className="font-display text-xl font-medium">
                  Practice
                </h3>
                <p className="mt-2 max-w-md text-muted">
                  Coding challenges pulled from the same concept, checked
                  against real test cases as you write.
                </p>
              </div>
            </div>

            <div className="flex gap-8 py-8">
              <span className="w-10 font-display text-2xl text-muted/40">
                3
              </span>
              <div>
                <h3 className="font-display text-xl font-medium">
                  Get feedback
                </h3>
                <p className="mt-2 max-w-md text-muted">
                  Mentor reviews your solution the way a senior engineer
                  would — pointing at the specific line, not just pass or
                  fail.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-border py-8 text-xs text-muted">
          <div className="flex items-center justify-between">
            <span className="font-mono">Mentor</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </main>
  );
}