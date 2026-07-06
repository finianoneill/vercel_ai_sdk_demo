"use client";

import { useState } from "react";

interface AgentStep {
  text: string;
  toolCalls: { toolName: string; input: unknown }[];
  toolResults: { toolName: string; output: unknown }[];
}

interface AgentRun {
  text: string;
  steps: AgentStep[];
  usage?: { inputTokens?: number; outputTokens?: number };
}

const EXAMPLE_PROMPT =
  "Roll 4 dice, then multiply the sum of the rolls by 17 and subtract 3.";

export default function AgentPage() {
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPT);
  const [run, setRun] = useState<AgentRun | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAgent(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setRun(null);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(`Agent run failed (${res.status})`);
      setRun(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Agent run failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent Loop</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          A <code className="font-mono">ToolLoopAgent</code> with calculator
          and dice tools runs until the task is done, then returns its full
          step-by-step trace.
        </p>
      </div>

      <form onSubmit={runAgent} className="space-y-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isLoading ? "Agent running…" : "Run agent"}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {run && (
        <div className="space-y-4">
          <div className="space-y-3">
            {run.steps.map((step, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="font-mono text-xs text-zinc-400">
                  step {i + 1}
                </div>
                {step.toolCalls.map((call, j) => (
                  <div
                    key={j}
                    className="mt-2 rounded-lg bg-indigo-50 p-3 text-sm dark:bg-indigo-950/40"
                  >
                    <span className="font-mono text-xs text-indigo-700 dark:text-indigo-300">
                      🔧 {call.toolName}({JSON.stringify(call.input)})
                    </span>
                    {step.toolResults[j] && (
                      <pre className="mt-1 overflow-x-auto text-xs text-zinc-600 dark:text-zinc-400">
                        → {JSON.stringify(step.toolResults[j].output)}
                      </pre>
                    )}
                  </div>
                ))}
                {step.text && (
                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {step.text}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Final answer
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm">{run.text}</p>
            {run.usage && (
              <p className="mt-2 font-mono text-xs text-zinc-500">
                tokens: {run.usage.inputTokens ?? "?"} in /{" "}
                {run.usage.outputTokens ?? "?"} out
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
