interface LessonContentProps {
  chapter: {
    id: number;
    title: string;
    description: string;
    sections: {
      title: string;
      content: string;
      examples?: {
        title: string;
        code: string;
        explanation: string;
      }[];
    }[];
    mcqTest: unknown[];
    codingChallenge: {
      title: string;
      scenario: string;
      instructions: string[];
    };
  };
  onSkipToTest: () => void;
}

export default function LessonContent({
  chapter,
  onSkipToTest,
}: LessonContentProps) {
  return (
    <section className="mx-auto max-w-4xl px-8 py-10">
      {/* Chapter Header */}
      <div className="mb-10">
        <div className="mb-3 text-sm font-medium text-blue-400">
          Chapter {chapter.id}
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
          {chapter.title}
        </h1>

        <p className="max-w-3xl text-lg leading-8 text-zinc-400">
          {chapter.description}
        </p>
      </div>

      {/* Learning Path */}
      <div className="mb-10 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-blue-400">
          1. Learn
        </span>

        <span className="text-zinc-600">→</span>

        <span className="rounded-full bg-zinc-800 px-3 py-1.5 text-zinc-300">
          2. See
        </span>

        <span className="text-zinc-600">→</span>

        <span className="rounded-full bg-zinc-800 px-3 py-1.5 text-zinc-300">
          3. Practice
        </span>

        <span className="text-zinc-600">→</span>

        <span className="rounded-full bg-zinc-800 px-3 py-1.5 text-zinc-300">
          4. Test
        </span>

        <span className="text-zinc-600">→</span>

        <span className="rounded-full bg-zinc-800 px-3 py-1.5 text-zinc-300">
          5. Code
        </span>
      </div>

      {/* Lesson Sections */}
      <div className="space-y-12">
        {chapter.sections.map((section, sectionIndex) => (
          <article key={section.title}>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-sm font-semibold text-zinc-300">
                {sectionIndex + 1}
              </span>

              <h2 className="text-2xl font-semibold text-white">
                {section.title}
              </h2>
            </div>

            <p className="mb-6 whitespace-pre-line text-base leading-8 text-zinc-400">
              {section.content}
            </p>

            {/* Examples */}
            {section.examples && section.examples.length > 0 && (
              <div className="space-y-5">
                {section.examples.map((example) => (
                  <div
                    key={example.title}
                    className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
                  >
                    <div className="border-b border-zinc-800 px-5 py-3">
                      <h3 className="text-sm font-semibold text-zinc-200">
                        {example.title}
                      </h3>
                    </div>

                    <pre className="overflow-x-auto p-5 text-sm leading-7 text-zinc-300">
                      <code>{example.code}</code>
                    </pre>

                    <div className="border-t border-zinc-800 bg-zinc-900/50 px-5 py-4">
                      <p className="text-sm leading-6 text-zinc-400">
                        <span className="font-medium text-zinc-200">
                          Why it matters:
                        </span>{" "}
                        {example.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Continue to Test */}
      <div className="mt-14 border-t border-zinc-800 pt-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-4">
            <div className="mb-2 text-sm font-medium text-blue-400">
              Ready to check your understanding?
            </div>

            <h2 className="text-xl font-semibold text-white">
              Test your knowledge
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              You&apos;ll answer 10 questions covering concepts, syntax,
              output prediction, debugging, and real-world JavaScript usage.
            </p>
          </div>

          <button
            onClick={onSkipToTest}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
          >
            Continue to Test →
          </button>
        </div>
      </div>

      {/* Coding Challenge Preview */}
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
        <div className="mb-2 text-sm font-medium text-emerald-400">
          Coding Challenge
        </div>

        <h2 className="text-xl font-semibold text-white">
          {chapter.codingChallenge.title}
        </h2>

        <p className="mt-3 text-sm leading-7 text-zinc-400">
          {chapter.codingChallenge.scenario}
        </p>

        <div className="mt-5">
          <div className="mb-3 text-sm font-medium text-zinc-300">
            You&apos;ll practice:
          </div>

          <ul className="space-y-2">
            {chapter.codingChallenge.instructions
              .slice(0, 3)
              .map((instruction) => (
                <li
                  key={instruction}
                  className="flex gap-2 text-sm text-zinc-400"
                >
                  <span className="text-emerald-400">✓</span>
                  <span>{instruction}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}