"use client";

import Link from "next/link";
import { FormEvent, useState, useSyncExternalStore } from "react";

function subscribeToLocation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getResetToken() {
  return new URLSearchParams(window.location.search).get("token") || "";
}

export default function ResetPasswordPage() {
  const token = useSyncExternalStore(subscribeToLocation, getResetToken, () => "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to reset your password.");
      }

      setStatus({ type: "success", message: "Your password has been reset successfully." });
      window.history.replaceState({}, "", "/reset-password");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
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
            Account recovery
          </div>

          <h2 className="max-w-sm font-display text-2xl font-medium leading-snug">
            Choose a new password to get back to learning.
          </h2>
        </div>

        <p className="text-sm text-muted" />
      </div>

      <div className="relative flex items-center justify-center px-6 py-16">
        <Link
          href="/login"
          className="absolute right-6 top-6 text-sm text-muted transition hover:text-foreground"
        >
          Back to sign in
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-medium tracking-tight">
              Reset password
            </h1>
            <p className="mt-2 text-sm text-muted">
              Choose a new password for your account.
            </p>
          </div>

          {!token && status?.type !== "success" && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              This password reset link is missing or invalid. Request a new one to continue.
            </div>
          )}

          {status?.type === "success" ? (
            <div className="space-y-5">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
                {status.message}
              </div>
              <Link
                href="/login"
                className="block w-full rounded-lg bg-accent px-5 py-3 text-center text-sm font-medium text-accent-foreground transition hover:opacity-90"
              >
                Sign in with your new password
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {status.message}
                </div>
              )}

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-muted">
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-muted">
                  Confirm new password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your new password again"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !token}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Resetting..." : "Set new password"}
              </button>

              <p className="text-center text-sm text-muted">
                Need a new link?{" "}
                <Link href="/forgot-password" className="font-medium text-foreground hover:text-accent">
                  Request another reset
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
