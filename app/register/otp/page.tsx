"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URLSearchParams(window.location.search).get("email") || "";
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed.");
      }

      setSuccess("Registered successfully. Redirecting to login...");
      window.setTimeout(() => router.push("/login"), 1500);
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-border bg-surface p-12 lg:flex">
        <Link href="/" className="font-display text-lg font-medium tracking-tight">
          Mentor AI
        </Link>

        <div>
          <div className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Almost there
          </div>

          <h2 className="max-w-sm font-display text-2xl font-medium leading-snug">
            Confirm your account and start learning.
          </h2>

          <div className="mt-8 rounded-lg border border-border bg-background p-5">
            <div className="mb-4 flex items-center justify-between text-xs text-muted">
              <span>Secure verification</span>
              <span className="font-mono text-accent">6-digit code</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              {[0, 1, 2, 3, 4, 5].map((digit) => (
                <div
                  key={digit}
                  className="flex h-12 w-10 items-center justify-center rounded-md border border-border bg-surface text-lg font-medium text-foreground"
                >
                  {digit === 0 ? "•" : ""}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted" />
      </div>

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
              Verify your email
            </h1>
            <p className="mt-2 text-sm text-muted">
              Enter the code we sent to {email || "your inbox"}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {success && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
                {success}
              </div>
            )}

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

            <div>
              <label htmlFor="code" className="mb-2 block text-sm font-medium text-muted">
                Verification code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
                autoComplete="one-time-code"
                className="w-full rounded-lg border border-border bg-surface py-3 px-4 text-center text-lg tracking-[0.35em] text-foreground outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </div>

            {error && !success && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || Boolean(success)}
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
              {isLoading ? "Verifying..." : "Verify email"}
            </button>

            <p className="text-center text-sm text-muted">
              Need a new code?{" "}
              <Link href="/register" className="font-medium text-foreground hover:text-accent">
                Start again
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
