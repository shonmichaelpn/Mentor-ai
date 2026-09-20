"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      // Our API returns { message: "..." }, not { success: true }
      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      router.push(`/register/otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Track your progress across every lesson",
    "Get feedback that points at your actual code",
    "Practice with coding challenges",
  ];

  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-2">
      {/* Left panel — desktop only */}
      <div className="hidden flex-col justify-between border-r border-border bg-surface p-12 lg:flex">
        <Link href="/" className="font-display text-lg font-medium tracking-tight">
          Mentor AI
        </Link>

        <div>
          <div className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Learn by building
          </div>

          <h2 className="max-w-sm font-display text-2xl font-medium leading-snug">
            Everything you need to actually learn to code.
          </h2>

          <ul className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-muted">
                <svg
                  viewBox="0 0 24 24"
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-muted">
        </p>
      </div>

      {/* Right panel — form */}
      <div className="relative flex items-center justify-center px-6 py-16">
        <Link
          href="/"
          className="absolute right-6 top-6 text-sm text-muted transition hover:text-foreground"
        >
          Exit to home
        </Link>

        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 block text-center font-display text-lg font-medium tracking-tight lg:hidden"
          >
            Mentor AI
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-medium tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted">
              Start your personalized learning journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-muted">
                Name
              </label>
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path strokeLinecap="round" d="M5 20c1.2-3.2 4-5 7-5s5.8 1.8 7 5" />
                </svg>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  className="w-full rounded-lg border border-border bg-surface py-3 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-muted">
                Email
              </label>
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6.5 12 13l9-6.5M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  />
                </svg>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-border bg-surface py-3 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-muted">
                Password
              </label>
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="5" y="10.5" width="14" height="9" rx="1.5" strokeLinejoin="round" />
                  <path strokeLinecap="round" d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-border bg-surface py-3 pl-11 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.5 10.5A2 2 0 0 0 13.5 13.5M9.5 6.1A10.8 10.8 0 0 1 12 6c4.7 0 8.8 3 10 6-.8 1.3-2.2 2.8-4.1 3.9M6.1 6.1A17.6 17.6 0 0 0 2 12c1.2 3 5.3 6 10 6a11.8 11.8 0 0 0 4.9-1.1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z"
                  />
                </svg>
              )}
              {isLoading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-foreground hover:text-accent">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}