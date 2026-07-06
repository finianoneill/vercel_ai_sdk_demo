"use client";

import { useCompletion } from "@ai-sdk/react";

export default function CompletionPage() {
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
  } = useCompletion({ api: "/api/completion" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Text Completion</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          <code className="font-mono">useCompletion</code> streams a single
          response with no conversation state — the pattern behind autocomplete
          and one-shot generation UIs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Write a haiku about TypeScript…"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium dark:border-zinc-700"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Generate
          </button>
        )}
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error.message}
        </div>
      )}

      {completion && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {completion}
          </p>
        </div>
      )}
    </div>
  );
}
