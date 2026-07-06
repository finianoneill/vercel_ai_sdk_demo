"use client";

import type { ToolUIPart } from "ai";

export function ToolCard({ part }: { part: ToolUIPart }) {
  const toolName = part.type.replace(/^tool-/, "");
  const isPending =
    part.state === "input-streaming" || part.state === "input-available";

  return (
    <div className="my-2 rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm dark:border-indigo-900 dark:bg-indigo-950/40">
      <div className="flex items-center gap-2 font-mono text-xs text-indigo-700 dark:text-indigo-300">
        <span>🔧 {toolName}</span>
        {isPending && <span className="animate-pulse">running…</span>}
      </div>
      {part.input != null && (
        <pre className="mt-2 overflow-x-auto text-xs text-zinc-600 dark:text-zinc-400">
          {JSON.stringify(part.input, null, 2)}
        </pre>
      )}
      {part.state === "output-available" && (
        <pre className="mt-2 overflow-x-auto rounded bg-white p-2 text-xs dark:bg-zinc-900">
          {JSON.stringify(part.output, null, 2)}
        </pre>
      )}
      {part.state === "output-error" && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          {part.errorText}
        </p>
      )}
    </div>
  );
}
