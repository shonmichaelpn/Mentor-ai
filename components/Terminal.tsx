interface TerminalProps {
  output: string;
  error: string | null;
  explanation?: string | null;
  isRunning?: boolean;
  onExplainError?: () => void;
}



export default function Terminal({
  output,
  error,
  explanation,
  isRunning = false,
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
                    className="mt-5 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
                  >
                    Explain Error
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