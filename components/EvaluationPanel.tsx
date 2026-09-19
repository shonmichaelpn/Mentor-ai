export interface Evaluation {
  passed: boolean;
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  mentorFeedback: string;
}

interface EvaluationPanelProps {
  evaluation: Evaluation | null;
  isEvaluating: boolean;
}

export default function EvaluationPanel({
  evaluation,
  isEvaluating,
}: EvaluationPanelProps) {
  if (isEvaluating) {
    return (
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-blue-400" />

          <div>
            <h3 className="font-semibold text-white">
              Mentor is evaluating your solution...
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              This may take a few seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return null;
  }

  return (
    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-blue-400">
            Mentor Evaluation
          </div>

          <h3 className="mt-1 text-xl font-semibold text-white">
            {evaluation.passed
              ? "Challenge Passed"
              : "Keep Working on It"}
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {evaluation.summary}
          </p>
        </div>

        {/* Score */}
        <div className="shrink-0 text-right">
          <div className="text-3xl font-bold text-white">
            {evaluation.score}
          </div>

          <div className="text-xs text-zinc-500">
            / 100
          </div>
        </div>
      </div>

      {/* Strengths */}
      {evaluation.strengths.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-emerald-400">
            ✓ Strengths
          </h4>

          <ul className="space-y-2">
            {evaluation.strengths.map((strength, index) => (
              <li
                key={index}
                className="text-sm leading-6 text-zinc-300"
              >
                • {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {evaluation.improvements.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-amber-400">
            ↑ Improvements
          </h4>

          <ul className="space-y-2">
            {evaluation.improvements.map((improvement, index) => (
              <li
                key={index}
                className="text-sm leading-6 text-zinc-300"
              >
                • {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mentor Feedback */}
      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
        <h4 className="mb-2 text-sm font-semibold text-blue-400">
          💡 Mentor Feedback
        </h4>

        <p className="text-sm leading-6 text-zinc-300">
          {evaluation.mentorFeedback}
        </p>
      </div>
    </div>
  );
}