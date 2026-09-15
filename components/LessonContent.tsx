import ReactMarkdown from "react-markdown";

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
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-lg font-semibold text-white">
                {sectionIndex + 1}
              </span>

              <h2 className="text-2xl font-semibold text-white">
                {section.title}
              </h2>
            </div>

            <div className="mb-6 text-base leading-8 text-zinc-400">
              <ReactMarkdown
                components={{
                  h3: ({ children }) => (
                    <h3 className="mt-8 mb-3 text-xl font-semibold text-white">
                      {children}
                    </h3>
                  ),

                  p: ({ children }) => (
                    <p className="mb-4 leading-8 text-zinc-300">
                      {children}
                    </p>
                  ),

                  code: ({ className, children }) => {
                    const isBlock = className?.includes("language-");

                    if (isBlock) {
                      return (
                        <pre className="my-5 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                          <code className="text-sm leading-7 text-zinc-200">
                            {children}
                          </code>
                        </pre>
                      );
                    }

                    return (
                      <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-blue-300">
                        {children}
                      </code>
                    );
                  },

                  table: ({ children }) => (
                    <div className="my-6 overflow-x-auto rounded-lg border border-zinc-800">
                      <table className="w-full text-left text-sm">
                        {children}
                      </table>
                    </div>
                  ),

                  th: ({ children }) => (
                    <th className="border-b border-zinc-800 bg-zinc-900 px-4 py-3 font-semibold text-white">
                      {children}
                    </th>
                  ),

                  td: ({ children }) => (
                    <td className="border-b border-zinc-800 px-4 py-3 text-zinc-300">
                      {children}
                    </td>
                  ),
                }}
              >
                {section.content}
              </ReactMarkdown>
            </div>

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
    </section>
  );
}