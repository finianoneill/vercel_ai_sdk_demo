"use client";

import type { ReasoningUIPart } from "ai";

export function ReasoningBlock({ part }: { part: ReasoningUIPart }) {
  const isThinking = part.state === "streaming";

  return (
    <details
      open={isThinking}
      className="my-2 rounded-lg border border-zinc-200 bg-zinc-50 text-sm dark:border-zinc-800 dark:bg-zinc-950/60"
    >
      <summary className="cursor-pointer select-none px-3 py-2 font-mono text-xs text-zinc-500">
        {isThinking ? (
          <span className="animate-pulse">💭 thinking…</span>
        ) : (
          "💭 reasoning"
        )}
      </summary>
      <p className="whitespace-pre-wrap px-3 pb-3 text-xs italic leading-relaxed text-zinc-500 dark:text-zinc-400">
        {part.text}
      </p>
    </details>
  );
}
