"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <header className="fixed inset-x-0 top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
          <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
            <div className="text-xl font-semibold tracking-tight">
              Mentor AI
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center pb-20 pt-40">
          <div className="w-full max-w-4xl text-center">
            <div className="mx-auto mb-6 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-emerald-400">
              Learn by building
            </div>

            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              Your personal
              <span className="block text-zinc-400">AI programming mentor.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              Learn programming through interactive lessons, knowledge tests,
              coding challenges, and AI-powered feedback that helps you
              understand where you went wrong.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="w-full rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 sm:w-auto"
              >
                Create an Account →
              </Link>

              <Link
                href="/login"
                className="w-full rounded-lg border border-zinc-700 px-7 py-3.5 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900 sm:w-auto"
              >
                I already have an account
              </Link>
            </div>

            <div className="mt-20 grid gap-4 text-left sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="text-sm font-semibold">Interactive Lessons</div>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Learn concepts with examples and guided explanations.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="text-sm font-semibold">Practice & Test</div>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Test your knowledge and apply each concept through coding
                  challenges.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="text-sm font-semibold">AI Feedback</div>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Get feedback on your code and learn from your mistakes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-600">
          Mentor AI · Interactive Programming Learning
        </footer>
      </div>
    </main>
  );
}
