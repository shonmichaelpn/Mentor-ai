import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    <section className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="mb-8 sm:mb-10">
        <div className="mb-3 text-sm font-medium text-accent">
          Chapter {chapter.id}
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {chapter.title}
        </h1>

        <p className="max-w-3xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
          {chapter.description}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2 text-xs sm:mb-10 sm:text-sm">
        <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-accent">
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

      <div className="space-y-8 sm:space-y-12">
        {chapter.sections.map((section, sectionIndex) => (
          <article key={section.title} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-base font-semibold text-white sm:h-10 sm:w-10 sm:text-lg">
                {sectionIndex + 1}
              </span>

              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                {section.title}
              </h2>
            </div>

            <div className="mb-6 text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h3: ({ children }) => (
                    <h3 className="mt-8 mb-3 text-lg font-semibold text-white sm:text-xl">
                      {children}
                    </h3>
                  ),

                  p: ({ children }) => (
                    <p className="mb-4 leading-7 text-zinc-300 sm:leading-8">
                      {children}
                    </p>
                  ),

                  code: ({ className, children }) => {
                    const isBlock = className?.includes("language-");

                    if (isBlock) {
                      return (
                        <pre className="my-5 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
                          <code className="text-xs leading-6 text-zinc-200 sm:text-sm sm:leading-7">
                            {children}
                          </code>
                        </pre>
                      );
                    }

                    return (
                      <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-blue-300 sm:text-sm">
                        {children}
                      </code>
                    );
                  },

                  table: ({ children }) => (
                    <div className="my-6 overflow-x-auto rounded-lg border border-zinc-800">
                      <table className="w-full text-left text-xs sm:text-sm">
                        {children}
                      </table>
                    </div>
                  ),

                  th: ({ children }) => (
                    <th className="border-b border-zinc-800 bg-zinc-900 px-3 py-2 font-semibold text-white sm:px-4 sm:py-3">
                      {children}
                    </th>
                  ),

                  td: ({ children }) => (
                    <td className="border-b border-zinc-800 px-3 py-2 text-zinc-300 sm:px-4 sm:py-3">
                      {children}
                    </td>
                  ),
                }}
              >
                {section.content}
              </ReactMarkdown>
            </div>

            {section.examples && section.examples.length > 0 && (
              <div className="space-y-4 sm:space-y-5">
                {section.examples.map((example) => (
                  <div
                    key={example.title}
                    className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
                  >
                    <div className="border-b border-zinc-800 px-4 py-3 sm:px-5">
                      <h3 className="text-sm font-semibold text-zinc-200">
                        {example.title}
                      </h3>
                    </div>

                    <pre className="overflow-x-auto p-4 text-xs leading-6 text-zinc-300 sm:p-5 sm:text-sm sm:leading-7">
                      <code>{example.code}</code>
                    </pre>

                    <div className="border-t border-zinc-800 bg-zinc-900/50 px-4 py-3 sm:px-5 sm:py-4">
                      <p className="text-xs leading-6 text-zinc-400 sm:text-sm sm:leading-6">
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