interface TerminalProps {
  output: string;
  error: string | null;
  explanation?: string | null;
  isRunning?: boolean;
  isExplainingError?: boolean;
  onExplainError?: () => void;
  language?: "javascript" | "python";
}

export default function Terminal({
  output,
  error,
  explanation,
  isRunning,
  isExplainingError,
  onExplainError,
  language = "javascript",
}: TerminalProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-border px-5">
        <span className="font-mono text-xs text-muted">
          output
        </span>

        {isRunning && (
          <span className="text-xs text-accent">
            Running...
          </span>
        )}

        {!isRunning && error && (
          <span className="text-xs text-red-400">
            Error
          </span>
        )}

        {!isRunning && !error && output && (
          <span className="text-xs text-emerald-400">
            Success
          </span>
        )}
      </div>

      {/* Content */}
      <div className="h-[500px] overflow-y-auto p-5">
        {isRunning ? (
          <div className="font-mono text-sm text-accent">
            {language === "python" ? "Executing Python..." : "Executing JavaScript..."}
          </div>
        ) : error ? (
              <div>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-red-400">
                  {error}
                </pre>

                {!explanation && (
                  <button
                    onClick={onExplainError}
                    disabled={isExplainingError}
                    className="mt-4 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isExplainingError ? "Thinking..." : "Explain Error"}
                  </button>
                )}

                {explanation && (
                  <div className="mt-5 border-t border-border pt-5">
                    <div className="mb-2 text-sm font-semibold text-accent">
                      💡 Mentor Explanation
                    </div>

                    <p className="whitespace-pre-line text-sm leading-7 text-muted">
                      {explanation}
                    </p>
                  </div>
                )}
              </div>
            ) : output ? (
          <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-foreground">
            {output}
          </pre>
        ) : (
          <div className="font-mono text-sm text-muted/50">
            Run your code to see what it does.
          </div>
        )}
      </div>
    </div>
  );
}