interface TerminalProps {
  output: string;
}

export default function Terminal({ output }: TerminalProps) {
  return (
    <div className="h-44 border-t border-zinc-800 bg-black">
      {/* Terminal header */}
      <div className="flex h-10 items-center border-b border-zinc-800 px-4">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Output
        </span>
      </div>

      {/* Terminal content */}
      <div className="overflow-auto p-4 font-mono text-sm">
        {output ? (
          <pre className="whitespace-pre-wrap text-zinc-300">
            {output}
          </pre>
        ) : (
          <span className="text-zinc-700">
            Run your code to see the output here...
          </span>
        )}
      </div>
    </div>
  );
}