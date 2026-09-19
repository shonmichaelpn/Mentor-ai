interface TerminalProps {
  output: string;
  error: string | null;
  explanation?: string | null;
  isRunning?: boolean;
  isExplainingError?: boolean;
  onExplainError?: () => void;
}



export default function Terminal({
  output,
  error,
  explanation,
  isRunning,
  isExplainingError,
  onExplainError,
}: TerminalProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-zinc-800 px-5">
        <span className="text-xs font-medium tracking-wider text-zinc-500">
          OUTPUT
        </span>

        {isRunning && (
          <span className="text-xs text-yellow-400">
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
          <div className="font-mono text-sm text-yellow-400">
            Executing JavaScript...
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
                    className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isExplainingError ? "Thinking..." : "Explain Error"}
                  </button>
                )}

                {explanation && (
                  <div className="mt-5 border-t border-zinc-800 pt-5">
                    <div className="mb-2 text-sm font-semibold text-blue-400">
                      💡 Mentor Explanation
                    </div>

                    <p className="whitespace-pre-line text-sm leading-7 text-zinc-400">
                      {explanation}
                    </p>
                  </div>
                )}
              </div>
            ) : output ? (
          <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-zinc-300">
            {output}
          </pre>
        ) : (
          <div className="font-mono text-sm text-zinc-600">
            Run your code to see what it does.
          </div>
        )}
      </div>
    </div>
  );
}