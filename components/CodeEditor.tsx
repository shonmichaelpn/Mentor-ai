"use client";

import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: "javascript" | "python";
}

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
}: CodeEditorProps) {
  return (
    <div className="h-[500px] overflow-hidden">
      <Editor
        height="100%"
        language={language}
        defaultLanguage={language}
        theme="vs-dark"
        value={value}
        onChange={(value) => onChange(value ?? "")}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 14,
          padding: {
            top: 16,
          },
          smoothScrolling: true,
          automaticLayout: true,
          tabSize: 2,
          scrollBeyondLastLine: false,
          scrollbar: {
            alwaysConsumeMouseWheel: false,
          },
        }}
      />
    </div>
  );
}